class ConferenceTreeNode {
  constructor(value, edgeWeight) {
    this.value = value;
    this.edgeWeight = edgeWeight;
    this.totalSum = 0;
    this.leftChild = null;
    this.rightChild = null;
  }
}

module.exports = ConferenceTreeNode;
