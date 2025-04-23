// src/logic/Minterm.js
/**
 *Class representing a minterm in Boolean logic with operations for Quine-McCluskey algorithm.
 *A minterm can represent either a single minterm value or a combined group of minterms.
 */
export default class Minterm {
  /**
   *Creates a Minterm instance.
   *@param {number} value - The decimal value of the minterm
   *@param {number} numberOfVariables - The number of variables in the Boolean function
   *@param {Set|null} setOfMinterms - Set of minterms this instance represents (for combined minterms)
   *@param {string|null} binaryRepresentation - Binary representation of the minterm
   */
  constructor(value, numberOfVariables, setOfMinterms = null, binaryRepresentation = null) {
    if (setOfMinterms === null) {
      //Constructor for a single minterm
      this.value = value;
      this.binaryRepresentation = this.toBinaryString(value, numberOfVariables);
      this.setOfMinterms = new Set();
      this.setOfMinterms.add(value);
    } else {
      //Constructor for combined minterms
      this.binaryRepresentation = binaryRepresentation;
      this.value = -1; //Combined minterms don't have a single value
      this.setOfMinterms = new Set(setOfMinterms);
    }
  }

  /**
   *Gets the decimal value of the minterm.
   *@returns {number} The decimal value (-1 for combined minterms)
   */
  getValue() {
    return this.value;
  }

  /**
   *Gets the binary representation of the minterm.
   *@returns {string} Binary representation (may include '-' for don't care positions)
   */
  getBinaryRepresentation() {
    return this.binaryRepresentation;
  }

  /**
   *Gets the set of minterms this instance represents.
   *@returns {Set} Set of decimal values of represented minterms
   */
  getSetOfMinterms() {
    return this.setOfMinterms;
  }

  /**
   *Counts the number of '1' bits in the binary representation.
   *@returns {number} Count of '1' bits
   */
  countNumberOfOnes() {
    let count = 0;
    for (const c of this.binaryRepresentation) {
      if (c === '1') count++;
    }
    return count;
  }

  /**
   *Converts a decimal value to binary string with specified length.
   *@param {number} value - Decimal value to convert
   *@param {number} numberOfVariables - Desired length of binary string
   *@returns {string} Binary representation with leading zeros if needed
   */
  toBinaryString(value, numberOfVariables) {
    let binary = value.toString(2);
    while (binary.length < numberOfVariables) {
      binary = '0' + binary;
    }
    return binary;
  }

  /**
   *Attempts to combine this minterm with another one.
   *Two minterms can be combined if they differ in exactly one bit position.
   *@param {Minterm} otherMinterm - Minterm to combine with
   *@returns {Object} Object with success flag and combined minterm if successful
   */
  combineMinterms(otherMinterm) {
    let differences = 0;
    let differencePosition = -1;

    for (let i = 0; i < this.binaryRepresentation.length; i++) {
      if (this.binaryRepresentation.charAt(i) !== otherMinterm.getBinaryRepresentation().charAt(i)) {
        differences++;
        differencePosition = i;
      }
    }

    if (differences === 1) {
      //If exactly one difference, create a new combined minterm
      const newBinary = this.binaryRepresentation.split('');
      newBinary[differencePosition] = '-'; //Mark the difference position as "don't care"
      
      const combinedMinterms = new Set([...this.setOfMinterms, ...otherMinterm.getSetOfMinterms()]);
      
      return {
        success: true,
        minterm: new Minterm(
          -1,
          null,
          combinedMinterms,
          newBinary.join('')
        )
      };
    }

    return { success: false };
  }

  /**
   *Checks if this minterm covers a specific decimal minterm value.
   *@param {number} mintermValue - The decimal value to check
   *@returns {boolean} True if this minterm covers the value
   */
  doesItMatch(mintermValue) {
    return this.setOfMinterms.has(mintermValue);
  }

  /**
   *Converts minterm to algebraic expression using provided variable names.
   *@param {string} variables - String of variable names (e.g., "ABCD")
   *@returns {string} Algebraic expression representing this minterm
   */
  mintermToExpression(variables) {
    let expression = '';
    for (let i = 0; i < this.binaryRepresentation.length; i++) {
      const bit = this.binaryRepresentation.charAt(i);
      if (bit !== '-') {
        if (expression.length > 0) {
          expression += '';
        }
        const variable = variables.charAt(i);
        if (bit === '0') {
          expression += `${variable}'`; //Complemented variable
        } else {
          expression += variable; //Uncomplemented variable
        }
      }
    }
    return expression;
  }

  /**
   *Checks if this minterm is equal to another.
   *Two minterms are equal if they have the same binary representation.
   *@param {Minterm} other - Minterm to compare with
   *@returns {boolean} True if minterms are equal
   */
  equals(other) {
    return this.binaryRepresentation === other.binaryRepresentation;
  }

  /**
   *Returns string representation of this minterm.
   *@returns {string} Binary representation
   */
  toString() {
    return this.binaryRepresentation;
  }
}