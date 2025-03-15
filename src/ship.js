function ship(length, hitNum, sunk) {
  return {
    length,
    hitNum,
    sunk,
    hit() {
      if (this.hitNum < this.length) {
        this.hitNum += 1;
        if (this.hitNum == this.length) {
          this.sunk = true;
        }
      }
    },
    isSunk() {
      return this.hitNum >= this.length;
    },
  };
}

export { ship };
