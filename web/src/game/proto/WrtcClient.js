import NetClient from './NetClient.js';

import 'regenerator-runtime/runtime';

export default class WrtcClient extends NetClient {

  constructor() {
    super();

    this.callbacks = {};
    this.peerConnection = null;
    this.dataChannel = null;
  }

  on(name, cb) {
    if (cb) {
      this.callbacks[name] = cb;
    } else {
      delete this.callbacks[name];
    }
  }

  send(name, data) {
    const payload = {name};
    if (data) {
      payload.data = data;
    }
    this.dataChannel.send(JSON.stringify(payload));
  }

  connect() {
    this.connectAsync()
      .catch(e => {
        console.error('Couldn\'t connect', e);
      });
  }

  onMessage(msg) {
    const payload = JSON.parse(msg.data);
    const {name, data} = payload;

    this.trigger(name, data);
  }

  trigger(name, data) {
    if (this.callbacks[name]) {
      this.callbacks[name](data);
    }
  }

  beforeAnswer() {
    this.peerConnection.addEventListener('datachannel', event => {
      this.dataChannel = event.channel;
      this.dataChannel.addEventListener('message', this.onMessage.bind(this));
    });

    const { close } = this.peerConnection;
    this.peerConnection.close = () => {
      if (this.dataChannel) {
        this.dataChannel.removeEventListener('message', this.onMessage.bind(this));
      }
      return close.apply(this, arguments);
    };
  }

  async connectAsync() {
    const response = await fetch('http://localhost:8080/a/connection');
    const connection = await response.json();

    const id = connection.id;
    const desc = connection.desc;

    const localPeerConnection = new RTCPeerConnection({
      sdpSemantics: 'unified-plan'
    });

    this.peerConnection = localPeerConnection;

    await localPeerConnection.setRemoteDescription(desc);
    this.beforeAnswer(localPeerConnection);

    const answer = await localPeerConnection.createAnswer();
    await localPeerConnection.setLocalDescription(answer);

    await fetch('http://localhost:8080/a/connection/remote', {
      method: 'POST',
      body: JSON.stringify({
        id,
        desc: localPeerConnection.localDescription
      }),
      headers: {
        'Content-type': 'application/json'
      }
    });

    this.trigger('connect');
  }

}
