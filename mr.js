(function () {
  'use strict';

  var controller, display, game;

  controller = {
    down: false,
    left: false,
    right: false,
    up: false,

    keyUpDown: function (event) {
      var key_state = event.type == 'keydown' ? true : false;

      switch (event.keyCode) {
        case 65:
          controller.left = key_state;
          break;
        case 87:
          controller.up = key_state;
          break;
        case 68:
          controller.right = key_state;
          break;
        case 83:
          controller.down = key_state;
          break;
      }
    },
  };

  display = {
    buffer: document.createElement('canvas').getContext('2d'),
    context: document.querySelector('canvas').getContext('2d'),
    output: document.querySelector('p'),

    render: function () {
      for (let index = game.world.map.length - 1; index > -1; --index) {
        this.buffer.fillStyle =
          game.world.map[index] > 0
            ? '#ffffff' + game.world.map[index] + 'f'
            : '#4c5661';
        this.buffer.fillRect(
          (index % game.world.columns) * game.world.tile_size,
          Math.floor(index / game.world.columns) * game.world.tile_size,
          game.world.tile_size,
          game.world.tile_size
        );
      }

      this.buffer.fillStyle = game.player.color;
      this.buffer.fillRect(
        game.player.x,
        game.player.y,
        game.player.width,
        game.player.height
      );

      this.context.drawImage(
        this.buffer.canvas,
        0,
        0,
        this.buffer.canvas.width,
        this.buffer.canvas.height,
        0,
        0,
        this.context.canvas.width,
        this.context.canvas.height
      );
    },

    resize: function (event) {
      var client_height = document.documentElement.clientHeight;

      display.context.canvas.width = document.documentElement.clientWidth - 32;

      if (display.context.canvas.width > client_height) {
        display.context.canvas.width = client_height;
      }

      display.context.canvas.height = Math.floor(
        display.context.canvas.width * 0.625
      );

      display.render();
    },
  };

  game = {
    player: {
      color: '#e63737',
      height: 19.9,
      old_x: 160,
      old_y: 160,
      velocity_x: 0,
      velocity_y: 0,
      width: 19.9,
      x: 274 - 16,
      y: 157 - 16,

      get bottom() {
        return this.y + this.height;
      },
      get oldBottom() {
        return this.old_y + this.height;
      },
      get left() {
        return this.x;
      },
      get oldLeft() {
        return this.old_x;
      },
      get right() {
        return this.x + this.width;
      },
      get oldRight() {
        return this.old_x + this.width;
      },
      get top() {
        return this.y;
      },
      get oldTop() {
        return this.old_y;
      },
    },

    world: {
      columns: 17,
      rows: 10,
      tile_size: 20,

      map: [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        1,
        1,
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        0,
        1,
        1,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        1,
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
      ],
    },

    collision: {
      1: function (object, row, column) {
        if (this.topCollision(object, row)) {
          return;
        }
        if (this.leftCollision(object, column)) {
          return;
        }
        if (this.rightCollision(object, column)) {
          return;
        }
        this.bottomCollision(object, row);
      },

      leftCollision(object, column) {
        if (object.x - object.old_x > 0) {
          var left = column * game.world.tile_size;

          if (object.right > left && object.oldRight <= left) {
            object.velocity_x = 0;
            object.x = object.old_x = left - object.width - 0.001;

            return true;
          }
        }

        return false;
      },

      rightCollision(object, column) {
        if (object.x - object.old_x < 0) {
          var right = (column + 1) * game.world.tile_size;

          if (object.left < right && object.oldLeft >= right) {
            object.velocity_x = 0;
            object.old_x = object.x = right;

            return true;
          }
        }

        return false;
      },

      bottomCollision(object, row) {
        if (object.y - object.old_y < 0) {
          var bottom = (row + 1) * game.world.tile_size;

          if (object.top < bottom && object.oldTop >= bottom) {
            object.velocity_y = 0;
            object.old_y = object.y = bottom;
          }
        }
      },

      topCollision(object, row) {
        if (object.y - object.old_y > 0) {
          var top = row * game.world.tile_size;

          if (object.bottom > top && object.oldBottom <= top) {
            object.velocity_y = 0;
            object.old_y = object.y = top - object.height - 0.01;

            return true;
          }
        }

        return false;
      },
    },

    loop: function () {
      if (controller.down) {
        game.player.velocity_y += 0.25;
      }

      if (controller.left) {
        game.player.velocity_x -= 0.25;
      }

      if (controller.right) {
        game.player.velocity_x += 0.25;
      }

      if (controller.up) {
        game.player.velocity_y -= 0.25;
      }

      game.player.old_x = game.player.x;
      game.player.old_y = game.player.y;

      game.player.x += game.player.velocity_x;
      game.player.y += game.player.velocity_y;

      if (game.player.x < 0) {
        game.player.velocity_x = 0;
        game.player.old_x = game.player.x = 0;
      } else if (
        game.player.x + game.player.width >
        display.buffer.canvas.width
      ) {
        game.player.velocity_x = 0;
        game.player.old_x = game.player.x =
          display.buffer.canvas.width - game.player.width - 0.001;
      }

      if (game.player.y < 0) {
        game.player.velocity_y = 0;
        game.player.old_y = game.player.y = 0;
      } else if (
        game.player.y + game.player.height >
        display.buffer.canvas.height
      ) {
        game.player.velocity_y = 0;
        game.player.old_y = game.player.y =
          display.buffer.canvas.height - game.player.height - 0.001;
      }

      if (game.player.x - game.player.old_x < 0) {
        var left_column = Math.floor(game.player.left / game.world.tile_size);
        var bottom_row = Math.floor(game.player.bottom / game.world.tile_size);
        var value_at_index =
          game.world.map[bottom_row * game.world.columns + left_column];

        if (value_at_index != 0) {
          game.collision[value_at_index](game.player, bottom_row, left_column);
          display.output.innerHTML =
            'last tile collided with: ' + value_at_index;
        }

        var top_row = Math.floor(game.player.top / game.world.tile_size);
        value_at_index =
          game.world.map[top_row * game.world.columns + left_column];

        if (value_at_index != 0) {
          game.collision[value_at_index](game.player, top_row, left_column);
          display.output.innerHTML =
            'last tile collided with: ' + value_at_index;
        }
      } else if (game.player.x - game.player.old_x > 0) {
        var right_column = Math.floor(game.player.right / game.world.tile_size);
        var bottom_row = Math.floor(game.player.bottom / game.world.tile_size);
        var value_at_index =
          game.world.map[bottom_row * game.world.columns + right_column];

        if (value_at_index != 0) {
          game.collision[value_at_index](game.player, bottom_row, right_column);
          display.output.innerHTML =
            'last tile collided with: ' + value_at_index;
        }

        var top_row = Math.floor(game.player.top / game.world.tile_size);
        value_at_index =
          game.world.map[top_row * game.world.columns + right_column];

        if (value_at_index != 0) {
          game.collision[value_at_index](game.player, top_row, right_column);
          display.output.innerHTML =
            'last tile collided with: ' + value_at_index;
        }
      }

      if (game.player.y - game.player.old_y < 0) {
        var left_column = Math.floor(game.player.left / game.world.tile_size);
        var top_row = Math.floor(game.player.top / game.world.tile_size);
        var value_at_index =
          game.world.map[top_row * game.world.columns + left_column];

        if (value_at_index != 0) {
          game.collision[value_at_index](game.player, top_row, left_column);
          display.output.innerHTML =
            'last tile collided with: ' + value_at_index;
        }

        var right_column = Math.floor(game.player.right / game.world.tile_size);
        value_at_index =
          game.world.map[top_row * game.world.columns + right_column];

        if (value_at_index != 0) {
          game.collision[value_at_index](game.player, top_row, right_column);
          display.output.innerHTML =
            'last tile collided with: ' + value_at_index;
        }
      } else if (game.player.y - game.player.old_y > 0) {
        var left_column = Math.floor(game.player.left / game.world.tile_size);
        var bottom_row = Math.floor(game.player.bottom / game.world.tile_size);
        var value_at_index =
          game.world.map[bottom_row * game.world.columns + left_column];

        if (value_at_index != 0) {
          game.collision[value_at_index](game.player, bottom_row, left_column);
          display.output.innerHTML =
            'last tile collided with: ' + value_at_index;
        }

        var right_column = Math.floor(game.player.right / game.world.tile_size);
        value_at_index =
          game.world.map[bottom_row * game.world.columns + right_column];

        if (value_at_index != 0) {
          game.collision[value_at_index](game.player, bottom_row, right_column);
          display.output.innerHTML =
            'last tile collided with: ' + value_at_index;
        }
      }

      game.player.velocity_x *= 0.9;
      game.player.velocity_y *= 0.9;

      display.render();

      window.requestAnimationFrame(game.loop);
    },
  };

  display.buffer.canvas.height = 200;
  display.buffer.canvas.width = 320;

  window.addEventListener('resize', display.resize);
  window.addEventListener('keydown', controller.keyUpDown);
  window.addEventListener('keyup', controller.keyUpDown);

  display.resize();

  game.loop();
})();