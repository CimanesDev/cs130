// src/logic/Minterm.js
export default class Minterm {
    constructor(value, numberOfVariables, setOfMinterms = null, binaryRepresentation = null) {
      if (setOfMinterms === null) {
        // Constructor for a single minterm
        this.value = value;
        this.binaryRepresentation = this.toBinaryString(value, numberOfVariables);
        this.setOfMinterms = new Set();
        this.setOfMinterms.add(value);
      } else {
        // Constructor for combined minterms
        this.binaryRepresentation = binaryRepresentation;
        this.value = -1;
        this.setOfMinterms = new Set(setOfMinterms);
      }
    }
  
    getValue() {
      return this.value;
    }
  
    getBinaryRepresentation() {
      return this.binaryRepresentation;
    }
  
    getSetOfMinterms() {
      return this.setOfMinterms;
    }
  
    countNumberOfOnes() {
      let count = 0;
      for (const c of this.binaryRepresentation) {
        if (c === '1') count++;
      }
      return count;
    }
  
    toBinaryString(value, numberOfVariables) {
      let binary = value.toString(2);
      while (binary.length < numberOfVariables) {
        binary = '0' + binary;
      }
      return binary;
    }
  
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
        const newBinary = this.binaryRepresentation.split('');
        newBinary[differencePosition] = '-';
        
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
  
    doesItMatch(mintermValue) {
      return this.setOfMinterms.has(mintermValue);
    }
  
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
            expression += `${variable}'`;
          } else {
            expression += variable;
          }
        }
      }
      return expression;
    }
  
    equals(other) {
      return this.binaryRepresentation === other.binaryRepresentation;
    }
  
    toString() {
      return this.binaryRepresentation;
    }
  }