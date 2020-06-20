import {v4 as uuid} from 'uuid';
import wrtc from 'wrtc';

import WrtcClient from './WrtcClient.js';

const TIME_TO_CONNECTED = 10000;
const TIME_TO_HOST_CANDIDATES = 3000;
const TIME_TO_RECONNECTED = 10000;

const RTCPeerConnection = wrtc.RTCPeerConnection;

async function waitUntilIceGatheringStateComplete(peerConnection) {
  if (peerConnection.iceGatheringState === 'complete') {
    return;
  }

  const deferred = {};
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });

  const timeout = setTimeout(() => {
    peerConnection.removeEventListener('icecandidate', onIceCandidate);
    deferred.reject(new Error('Timed out waiting for host candidates'));
  }, TIME_TO_HOST_CANDIDATES);

  function onIceCandidate({ candidate }) {
    if (!candidate) {
      clearTimeout(timeout);
      peerConnection.removeEventListener('icecandidate', onIceCandidate);
      deferred.resolve();
    }
  }

  peerConnection.addEventListener('icecandidate', onIceCandidate);

  await deferred.promise;
}

export default class WrtcStuff {

  constructor() {
    this.clients = { };
  }

  onConnected(cb) {
    this.onConnectedCallback = cb;
  }

  close(clientId) {
    const client = this.clients[clientId];
    client.trigger('disconnect');

    delete this.clients[clientId];
  }

  iceStuff(id, connection) {
    let connectionTimer = setTimeout(() => {
      const state = connection.iceConnectionState;

      if (state !== 'connected' && state !== 'completed') {
        this.close(id);
      }
    }, TIME_TO_CONNECTED);

    let reconnectionTimer = null;

    connection.addEventListener('iceconnectionstatechange', () => {
      const state = connection.iceConnectionState;

      if (state === 'connected' || state === 'completed') {
        if (connectionTimer) {
          clearTimeout(connectionTimer);
          connectionTimer = null;
        }
        clearTimeout(reconnectionTimer);
        reconnectionTimer = null;
      } else if (state === 'disconnected' || state === 'failed') {
        if (!connectionTimer && !reconnectionTimer) {
          reconnectionTimer = setTimeout(() => {
            this.close(id);
          }, TIME_TO_RECONNECTED);
        }
      }
    });
  }


  async createConnection() {
    const peerConnection = new RTCPeerConnection({
      sdpSemantics: 'unified-plan'
    });

    const id = uuid();

    this.clients[id] = new WrtcClient(
      peerConnection,
      clientCb => {
        for (let otherClientId in this.clients) {
          if (otherClientId !== id) {
            const client = this.clients[otherClientId];
            clientCb(client);
          }
        }
      }
    );

    this.iceStuff(id, peerConnection);

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    await waitUntilIceGatheringStateComplete(peerConnection);

    return {
      id,
      desc: peerConnection.localDescription
    };
  }

  async applyAnswer(id, remoteDescription) {
    const client = this.clients[id];
    const connection = client.connection;
    await connection.setRemoteDescription(remoteDescription);

    setTimeout(() => {
      this.onConnectedCallback(client);
    }, 500);
  }

}
