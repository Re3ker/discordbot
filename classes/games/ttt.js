class TTTGame {
    constructor(player) {
        this.fields = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        this.players = [];
        this.players.push(player);
        this.cur = 0;
    }

    setField(pos) {
        let x = 0;
        let y = 0;
        switch (parseInt(pos)) {
            case 1:
                x = 0;
                y = 0;
                break;
            case 2:
                x = 1;
                y = 0;
                break;
            case 3:
                x = 2;
                y = 0;
                break;
            case 4:
                x = 0;
                y = 1;
                break;
            case 5:
                x = 1;
                y = 1;
                break;
            case 6:
                x = 2;
                y = 1;
                break;
            case 7:
                x = 0;
                y = 2;
                break;
            case 8:
                x = 1;
                y = 2;
                break;
            case 9:
                x = 2;
                y = 2;
                break;
        }
        if (this.fields[y][x] == 0) {
            this.fields[y][x] = this.cur;
            if (this.cur == 1) {
                this.cur = 2;
            } else {
                this.cur = 1;
            }
            return true;
        }
        return false;
    }

    check() {
        let full = true;
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                if (this.fields[r][c] == 0) {
                    full = false;
                }
            }
        }

        for (let i = 1; i < 3; i++) {
            if (this.fields[0][0] == i && this.fields[0][1] == i && this.fields[0][2] == i) return i;
            if (this.fields[1][0] == i && this.fields[1][1] == i && this.fields[1][2] == i) return i;
            if (this.fields[2][0] == i && this.fields[2][1] == i && this.fields[2][2] == i) return i;
            if (this.fields[0][0] == i && this.fields[1][0] == i && this.fields[2][0] == i) return i;
            if (this.fields[0][1] == i && this.fields[1][1] == i && this.fields[2][1] == i) return i;
            if (this.fields[0][2] == i && this.fields[1][2] == i && this.fields[2][2] == i) return i;
            if (this.fields[0][0] == i && this.fields[1][1] == i && this.fields[2][2] == i) return i;
            if (this.fields[0][2] == i && this.fields[1][1] == i && this.fields[2][0] == i) return i;
        }

        if (full == true) {
            return -1;
        }

        return false;
    }

    getFields() {
        return this.fields;
    }
}

module.exports = TTTGame;