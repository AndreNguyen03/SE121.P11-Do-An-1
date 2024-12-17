export const generateSudoku6x6 = () => {
    const grid = Array(6)
        .fill(null)
        .map(() => Array(6).fill(null));

    const fillGrid = (row = 0, col = 0) => {
        if (row === 6) return true; // Đã hoàn thành lưới
        if (col === 6) return fillGrid(row + 1, 0); // Chuyển sang dòng tiếp theo

        // Tạo danh sách số ngẫu nhiên từ 1 đến 6
        const nums = [1, 2, 3, 4, 5, 6].sort(() => Math.random() - 0.5);

        for (let num of nums) {
            if (isValidMove(grid, row, col, num)) {
                grid[row][col] = num; // Điền số vào ô hiện tại

                if (fillGrid(row, col + 1)) return true; // Tiếp tục đệ quy
                grid[row][col] = null; // Nếu không thành công, quay lui
            }
        }
        return false; // Không thể điền số hợp lệ
    };
     

    fillGrid(); // Điền toàn bộ lưới Sudoku
    return grid;
};

export const createPuzzle = (grid, emptyCells = 12) => {
    const puzzle = grid.map((row) => [...row]); // Tạo bản sao lưới hoàn chỉnh

    let removed = 0;
    while (removed < emptyCells) {
        const row = Math.floor(Math.random() * 6);
        const col = Math.floor(Math.random() * 6);

        if (puzzle[row][col] !== null) {
            puzzle[row][col] = null; // Xóa số
            removed++;
        }
    }

    return puzzle;
};

export const isValidMove = (grid, row, col, num) => {
    // Kiểm tra hàng
    for (let i = 0; i < 6; i++) {
        if (grid[row][i] === num) return false;
    }

    // Kiểm tra cột
    for (let i = 0; i < 6; i++) {
        if (grid[i][col] === num) return false;
    }

    // Kiểm tra khối 2x3
    const boxRowStart = Math.floor(row / 2) * 2;
    const boxColStart = Math.floor(col / 3) * 3;
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[boxRowStart + i][boxColStart + j] === num) return false;
        }
    }

    return true;
};