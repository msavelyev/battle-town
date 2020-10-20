import Client from '@Client/tanks/client/game/proto/Client.js';

export function createGameLoopResult(match, netMessages) {
  return {
    match,
    netMessages,
  };
}

export function createGameLoop(game, ctx, input, client) {
  return {
    update(event) {
      const netInput = Client.getTicks(client);
      const match = game.match;
      const id = game.id;

      const gameLoopInput = {
        event,
        ctx,
        id,
        match,
        input,
        networkInput: netInput,
      };

      const gameLoopOutput = game.update(gameLoopInput);
      game.match = gameLoopOutput.match;
      game.render(event);
      Client.clearTicks(client);

      for (const netMessage of gameLoopOutput.netMessages) {
        Client.sendNetMessage(client, netMessage);
      }
    }
  };
}
