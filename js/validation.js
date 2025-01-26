// Input validation functions
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

const Validator = {
    // General validation
    validateInput(input) {
        if (!input || input.trim() === '') {
            throw new ValidationError('Input cannot be empty');
        }
    },

    // Validate comma-separated integers
    validateIntegerArray(input) {
        this.validateInput(input);
        const values = input.split(/[,\s]+/);
        
        if (values.length === 0) {
            throw new ValidationError('Please enter at least one number');
        }

        for (let value of values) {
            if (!/^-?\d+$/.test(value.trim())) {
                throw new ValidationError(`Invalid input: "${value}" is not a valid integer`);
            }
        }

        return values.map(v => parseInt(v));
    },

    // Validate level-order traversal input
    validateLevelOrder(input) {
        this.validateInput(input);
        const values = input.split(/[,\s]+/);
        
        if (values.length === 0) {
            throw new ValidationError('Please enter at least one value');
        }

        if (values[0] === 'N') {
            throw new ValidationError('Root node cannot be null (N)');
        }

        for (let value of values) {
            if (value !== 'N' && !/^-?\d+$/.test(value.trim())) {
                throw new ValidationError(`Invalid input: "${value}" is not a valid integer or 'N'`);
            }
        }

        return values.map(v => v === 'N' ? 'N' : parseInt(v));
    },

    // Validate BST level-order traversal
    validateBSTLevelOrder(input) {
        const values = this.validateLevelOrder(input);
        
        // Check if the values form a valid BST
        function isValidBST(values) {
            if (!values.length) return true;

            function validateNode(index, min, max) {
                if (index >= values.length || values[index] === 'N') return true;
                
                const value = values[index];
                if (value <= min || value >= max) return false;

                return validateNode(2 * index + 1, min, value) && // left subtree
                       validateNode(2 * index + 2, value, max);   // right subtree
            }

            return validateNode(0, -Infinity, Infinity);
        }

        if (!isValidBST(values)) {
            throw new ValidationError('The input does not represent a valid Binary Search Tree');
        }

        return values;
    },

    // Validate sequential BST input
    validateBSTSequential(input) {
        return this.validateIntegerArray(input);
    },

    // Validate heap input
    validateHeapInput(input) {
        return this.validateIntegerArray(input);
    },

    // Validate AVL tree input
    validateAVLInput(input) {
        return this.validateLevelOrder(input);
    }
};

// Helper function to verify complete binary tree structure
function isCompleteTree(arr) {
    let hasNull = false;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === 'N') {
            hasNull = true;
        } else if (hasNull) {
            // If we find a non-null value after finding a null, it's not complete
            return false;
        }
    }
    return true;
}

// Export the validator
window.Validator = Validator;