class AVLNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

class AVLTree {
    constructor() {
        this.root = null;
    }

    height(node) {
        return node ? node.height : 0;
    }

    balanceFactor(node) {
        return node ? this.height(node.left) - this.height(node.right) : 0;
    }

    updateHeight(node) {
        if (node) {
            node.height = Math.max(this.height(node.left), this.height(node.right)) + 1;
        }
    }

    rightRotate(y) {
        let x = y.left;
        let T2 = x.right;

        x.right = y;
        y.left = T2;

        this.updateHeight(y);
        this.updateHeight(x);

        return x;
    }

    leftRotate(x) {
        let y = x.right;
        let T2 = y.left;

        y.left = x;
        x.right = T2;

        this.updateHeight(x);
        this.updateHeight(y);

        return y;
    }

    insert(node, value) {
        if (!node) {
            return new AVLNode(value);
        }

        if (value < node.value) {
            node.left = this.insert(node.left, value);
        } else if (value > node.value) {
            node.right = this.insert(node.right, value);
        } else {
            return node; // Duplicate values not allowed
        }

        this.updateHeight(node);

        let balance = this.balanceFactor(node);

        // Left Left Case
        if (balance > 1 && value < node.left.value) {
            return this.rightRotate(node);
        }

        // Right Right Case
        if (balance < -1 && value > node.right.value) {
            return this.leftRotate(node);
        }

        // Left Right Case
        if (balance > 1 && value > node.left.value) {
            node.left = this.leftRotate(node.left);
            return this.rightRotate(node);
        }

        // Right Left Case
        if (balance < -1 && value < node.right.value) {
            node.right = this.rightRotate(node.right);
            return this.leftRotate(node);
        }

        return node;
    }

    // Function to build AVL tree from level order traversal
    buildFromLevelOrder(values) {
        this.root = null;
        if (!values || !values.length) return;

        for (let value of values) {
            if (value !== 'N' && value !== null) {
                this.root = this.insert(this.root, value);
            }
        }
    }

    // Function to convert AVL tree to array representation for visualization
    toArray() {
        if (!this.root) return [];
        
        let result = [];
        let queue = [this.root];
        
        while (queue.length > 0) {
            let node = queue.shift();
            result.push(node.value);
            
            if (node.left) queue.push(node.left);
            else if (result.length * 2 < Math.pow(2, Math.floor(Math.log2(result.length)) + 2) - 1) {
                result.push('N');
            }
            
            if (node.right) queue.push(node.right);
            else if (result.length * 2 < Math.pow(2, Math.floor(Math.log2(result.length)) + 2) - 1) {
                result.push('N');
            }
        }
        
        // Trim trailing nulls
        while (result[result.length - 1] === 'N') {
            result.pop();
        }
        
        return result;
    }
}