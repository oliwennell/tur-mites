
function AntWalk(_canvas) {
    var self = this;

    var cellSize = 5;

    var canvas = _canvas;
    var context = canvas.getContext('2d');

    var colours = [ 
        'rgb(000,255,255)',
        'rgb(000,148,255)',
        'rgb(000,038,255)',
        'rgb(072,000,255)'
    ];
    var string = "RRLLLRLLLRRR";

    var cellIndexFromCoordinates = function (x, y, height) {
        return y + x * height;
    };

    Number.prototype.mod = function(n) { 
        return ((this % n) + n) % n; 
    }

    function Ant(_grid, _x, _y, _string) {
        var self = this;

        var grid = _grid;
        var x = _x;
        var y = _y;
        var headings = [ 'N', 'E', 'S', 'W' ];
        var headingIndex = 3;
        var string = _string;

        var getCurrentCellValue = function() {
            return grid.cells[cellIndexFromCoordinates(x, y, grid.height)];
        };

        var setCurrentCellValue = function(value) {
            grid.cells[cellIndexFromCoordinates(x, y, grid.height)] = value;
        };

        var rotateRight = function() {
            headingIndex = (headingIndex + 1).mod(headings.length);
        };

        var rotateLeft = function() {
            headingIndex = (headingIndex - 1).mod(headings.length);
        };

        var moveForward = function() {
            switch (headings[headingIndex]) {
                case 'N': y = (y - 1) % grid.height; break;
                case 'E': x = (x + 1) % grid.width; break;
                case 'S': y = (y + 1) % grid.height; break;
                case 'W': x = (x - 1) % grid.height; break;
            }
        };

        self.update = function() {
            var currentValue = getCurrentCellValue();

            if (string[currentValue] == 'R') {
                rotateRight();
            }
            else {
                rotateLeft();
            }

            setCurrentCellValue((currentValue + 1) % (string.length+1));
            moveForward();
        };
    }

    var grid = {
        width: canvas.width / cellSize,
        height: canvas.height / cellSize,
        cells: []
    };
    for (var i=0; i<grid.width*grid.height; ++i)
        grid.cells[i] = 0;

    var ant = new Ant(
        grid, 
        Math.floor(grid.width/2),
        Math.floor(grid.height/2),
        string);

    var update = function () {
        ant.update();
    };

    var render = function () {
        context.clearRect(0, 0, canvas.width, canvas.height);

        var cellsToDraw = [];
        for (var y = 0; y < grid.height; ++y) {
            for (var x = 0; x < grid.width; ++x) {
                var cellValue = grid.cells[cellIndexFromCoordinates(x, y, grid.height)];
                if (cellValue == 0)
                    continue;

                cellsToDraw.push({ 
                    x: x, 
                    y: y, 
                    value: cellValue 
                });
            }
        }

        for (var index = 0; index < cellsToDraw.length; ++index) {
            var cell = cellsToDraw[index];
            context.fillStyle = colours[cell.value % colours.length];
            context.fillRect(
                cell.x * cellSize,
                cell.y * cellSize,
                cellSize,
                cellSize);
        }
    };

    var num = 0;
    var interval = setInterval(function() {
        update();
        render();

        num++;
        if (num > 100000)
            clearInterval(interval);
    }, 1);
};

$(document).ready(function () {
    var canvas = document.getElementById('ant-walk-canvas');
    new AntWalk(canvas);
});