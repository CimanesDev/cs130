/**
 *Implementation of the Quine-McCluskey algorithm for simplifying boolean expressions.
 *This class particularly focuses on converting Product of Sums (POS) expressions.
 */
import Minterm from './Minterm';

export default class QuineMcCluskeyAlgorithm {
  /**
   *Creates a new QuineMcCluskeyAlgorithm instance.
   *@param {number[]} mintermsDecimal - Array of decimal values representing the original minterms.
   *@param {string} variablesLetter - String of characters representing variables (e.g., "ABC").
   */
  constructor(mintermsDecimal, variablesLetter) {
    // Store original minterms
    this.originalMinterms = [...mintermsDecimal];
    this.variablesLetter = variablesLetter;
    this.numberOfVariables = variablesLetter.length;
    
    // Check for tautology or contradiction
    this.isTautology = this.checkTautology(mintermsDecimal);
    
    if (!this.isTautology) {
      
      // Generate the complement of the minterms (maxterms)
      this.mintermsDecimal = this.generateComplement(mintermsDecimal);
      
      // Initialize data structures
      this.mintermList = [];
      this.simplification = [];
      this.primeImplicants = [];
      this.essentialPrimeImplicants = [];
      this.simplificationDisplay = '';
      this.primeImplicantTableDisplay = '';
      this.essentialPrimeImplicantsDisplay = '';

      // Convert decimal minterms to binary representation
      for (const m of this.mintermsDecimal) {
        this.mintermList.push(new Minterm(m, this.numberOfVariables));
      }
    }
  }

  /**
   *Check if the expression is a tautology (always true).
   *A boolean expression is a tautology when all possible minterms are included.
   *@param {number[]} minterms - Array of decimal values.
   *@returns {boolean} True if the expression is a tautology.
   */
  checkTautology(minterms) {
    const totalPossibleMinterms = 1 << this.numberOfVariables; // 2^n
    
    //If all possible minterms are included, the complement will be empty
    //which means this is a tautology
    return minterms.length === totalPossibleMinterms;
  }

  /**
   *Generate the complement of the given minterms (converts to maxterms).
   *@param {number[]} minterms - Array of decimal values.
   *@returns {number[]} The complement set of minterms.
   */
  generateComplement(minterms) {
    const totalPossibleMinterms = 1 << this.numberOfVariables; // 2^n
    const complement = [];
    
    //
    for (let i = 0; i < totalPossibleMinterms; i++) {
      if (!minterms.includes(i)) {
        complement.push(i);
      }
    }
    
    return complement;
  }

  /**
   *Main method to execute the Quine-McCluskey algorithm.
   */
  solve() {
    //Check if it's a tautology first
    if (this.isTautology) {
      return;
    }
    
    // Step 1: Group by ones
    const groups = this.groupByOnes();

    // Step 2: Find prime implicants
    this.findPrimeImplicants(groups);

    // Step 3: Create prime implicant table
    this.createPrimeImplicantTable();

    // Step 4: Find essential prime implicants
    this.findEssentialPrimeImplicants();
  }

  /**
   *Groups minterms by the number of '1' bits in their binary representation.
   *@returns {Array<Array<Minterm>>} Groups of minterms.
   */
  groupByOnes() {
    //Create an array of groups, one for each possible number of '1' bits
    const groups = Array(this.numberOfVariables + 1).fill().map(() => []);
    

    //Place each minterm in the appropriate group based on the number of '1' bits
    for (const m of this.mintermList) {
      const groupNumber = m.countNumberOfOnes();
      groups[groupNumber].push(m);
    }

    return groups;
  }

  /**
   *Finds all prime implicants by iteratively combining minterms that differ by one bit.
   *@param {Array<Array<Minterm>>} groups - Initially grouped minterms.
   */
  findPrimeImplicants(groups) {
    let currentGroups = groups;
    // Track the simplification process
    this.simplification.push(currentGroups.map(group => [...group]));
    
    //Track all terms for later verification
    //Used Set to avoid duplicates and ensure uniqueness
    const allTerms = new Set();
    this.mintermList.forEach(m => allTerms.add(m));

    //Iterate until no more combinations can be made
    while (true) {
      const newGroups = [];
      let hasCombinations = false;
      
      //Track which terms were combined in this iteration
      const combinedTerms = new Set();

      //Compare adjacent groups (those that differ by one '1' bit)
      for (let i = 0; i < currentGroups.length - 1; i++) {
        const currentGroup = currentGroups[i];
        const nextGroup = currentGroups[i + 1];
        // If either group is empty, skip to the next iteration
        if (currentGroup.length === 0 || nextGroup.length === 0) {
          newGroups.push([]);
          continue;
        }

        const combinedGroup = [];

        //Try to combine each minterm from currentGroup with each from nextGroup
        for (const minterm1 of currentGroup) {
          for (const minterm2 of nextGroup) {
            //Attempt to combine the two minterms
            //If they differ by one bit, create a new minterm
            const { success, minterm } = minterm1.combineMinterms(minterm2);
            if (success) {
              hasCombinations = true;
              combinedTerms.add(minterm1);
              combinedTerms.add(minterm2);
              
              //Add new minterm to all terms
              allTerms.add(minterm);

              //Check if term already exists to avoid duplicates
              const existing = combinedGroup.find(m => m.equals(minterm));
              if (existing) {
                //Merge the set of minterms
                minterm.getSetOfMinterms().forEach(m => existing.getSetOfMinterms().add(m));
              } else {
                combinedGroup.push(minterm);
              }
            }
          }
        }

        newGroups.push(combinedGroup);
      }

      //Find terms that weren't combined - these are prime implicants
      if (currentGroups.length > 0) {
        for (const group of currentGroups) {
          for (const term of group) {
            if (!combinedTerms.has(term)) {
              this.primeImplicants.push(term);
            }
          }
        }
      }

      //If no new combinations were made, we're done
      if (!hasCombinations) break;

      currentGroups = newGroups;
      //
      this.simplification.push(newGroups.map(group => [...group]));
    }

    //Add the terms from the final iteration as prime implicants
    if (currentGroups.length > 0) {
      for (const group of currentGroups) {
        for (const term of group) {
          this.primeImplicants.push(term);
        }
      }
    }

    //Remove duplicates from prime implicants
    this.primeImplicants = this.primeImplicants.filter(
      (m, i, self) => i === self.findIndex(mm => mm.equals(m))
    );
  }

  /**
   *Creates a textual prime implicant table showing which prime implicants cover which minterms.
   */
  createPrimeImplicantTable() {
    if (this.isTautology) {
      this.primeImplicantTableDisplay = "Tautology (always true): No prime implicant table needed.";
      return;
    }
    
    let table = `Prime Implicant        | `;
    table += this.mintermsDecimal.map(m => m.toString().padEnd(4)).join('');
    table += '\n';
    table += '-'.repeat(22) + '-|-' + '-'.repeat(this.mintermsDecimal.length * 4) + '\n';

    for (const pi of this.primeImplicants) {
      //Convert the prime implicant to a POS term
      const expr = this.mintermToPOSExpression(pi);
      table += expr.padEnd(22) + ' | ';
      
      //Mark which minterms this prime implicant covers
      for (const m of this.mintermsDecimal) {
        table += (pi.doesItMatch(m) ? 'X' : '').padEnd(4);
      }
      table += '\n';
    }

    this.primeImplicantTableDisplay = table;
  }

  /**
   *Returns structured data about the prime implicants and the minterms they cover.
   *@returns {Object} Object containing prime implicant data and minterms.
   */
  getPrimeImplicantTableData() {
    if (this.isTautology) {
      return {
        tautology: true,
        primeImplicants: [],
        minterms: []
      };
    }
    
    return {
      tautology: false,
      primeImplicants: this.primeImplicants.map(pi => ({
        expression: this.mintermToPOSExpression(pi),
        minterms: [...pi.getSetOfMinterms()]
      })),
      minterms: this.mintermsDecimal
    };
  }

  /**
   *Converts a minterm to a Product of Sums (POS) expression.
   *@param {Minterm} minterm - The minterm to convert.
   *@returns {string} The POS expression.
   */
  mintermToPOSExpression(minterm) {
    const binRep = minterm.getBinaryRepresentation();
    let expr = '';
    let firstVar = true;
    
    //For POS, we need to show it as a sum term
    expr += '(';
    
    for (let i = 0; i < binRep.length; i++) {
      const bit = binRep.charAt(i);
      if (bit !== '-') {
        if (!firstVar) {
          expr += ' + ';
        } else {
          firstVar = false;
        }
        
        //For POS from maxterms, if bit is 0, variable is uncomplemented
        //If bit is 1, variable is complemented
        const varName = this.variablesLetter.charAt(i);
        expr += bit === '0' ? varName : `${varName}'`;
      }
    }
    
    expr += ')';
    return expr;
  }

  /**
   *Finds essential prime implicants, those that are the only ones covering a particular minterm.
   *Also finds additional prime implicants to cover all minterms.
   */
  findEssentialPrimeImplicants() {
    if (this.isTautology) {
      this.essentialPrimeImplicantsDisplay = "This is a tautology (always true). No essential prime implicants needed.";
      return;
    }
    
    //Create a map of which prime implicants cover each minterm
    const coverageMap = new Map();
    for (const m of this.mintermsDecimal) {
      coverageMap.set(m, []);
    }
  
    //Find which prime implicants cover each minterm
    for (const pi of this.primeImplicants) {
      for (const m of this.mintermsDecimal) {
        if (pi.doesItMatch(m)) {
          coverageMap.get(m).push(pi);
        }
      }
    }
  
    const coveredMinterms = new Set();
  
    //Find essential prime implicants (those that are the only ones covering a minterm)
    for (const [minterm, pis] of coverageMap.entries()) {
      if (pis.length === 1) {
        const epi = pis[0];
        if (!this.essentialPrimeImplicants.some(e => e.equals(epi))) {
          this.essentialPrimeImplicants.push(epi);
          
          //Add all minterms covered by this essential prime implicant
          for (const cm of this.mintermsDecimal) {
            if (epi.doesItMatch(cm)) {
              coveredMinterms.add(cm);
            }
          }
        }
      }
    }
  
    let display = "Essential Prime Implicants:\n";
    if (this.essentialPrimeImplicants.length === 0) {
      display += "No essential prime implicants found\n";
    } else {
      for (const epi of this.essentialPrimeImplicants) {
        display += `- ${this.mintermToPOSExpression(epi)}\n`;
      }
    }
  
    //Handle minterms not covered by essential prime implicants
    const uncovered = this.mintermsDecimal.filter(m => !coveredMinterms.has(m));
    if (uncovered.length > 0) {
      display += `\nNot all minterms are covered by essential prime implicants\n`;
      display += `Uncovered minterms: ${uncovered.join(', ')}\n`;
  
      //Add additional prime implicants to cover remaining minterms
      let remainingUncovered = [...uncovered];
      while (remainingUncovered.length > 0) {
        let bestPi = null;
        let maxCoverage = 0;
  
        //Find prime implicant that covers most uncovered minterms
        for (const pi of this.primeImplicants) {
          //Skip if already an essential prime implicant
          if (this.essentialPrimeImplicants.some(epi => epi.equals(pi))) continue;
          
          let coverCount = 0;
          for (const m of remainingUncovered) {
            if (pi.doesItMatch(m)) coverCount++;
          }
  
          if (coverCount > maxCoverage) {
            maxCoverage = coverCount;
            bestPi = pi;
          }
        }
  
        if (bestPi && maxCoverage > 0) {
          this.essentialPrimeImplicants.push(bestPi);
          display += `Added additional prime implicant: ${this.mintermToPOSExpression(bestPi)}\n`;
          
          //Remove covered minterms
          remainingUncovered = remainingUncovered.filter(m => !bestPi.doesItMatch(m));
        } else {
          break;
        }
      }
    }
  
    display += "\nFinal Prime Implicants:\n";
    for (const pi of this.essentialPrimeImplicants) {
      display += `- ${this.mintermToPOSExpression(pi)}\n`;
    }
  
    this.essentialPrimeImplicantsDisplay = display;
  }

  /**
   *Displays the initial grouping of minterms by number of '1' bits.
   *@returns {string} Formatted output of grouped minterms.
   */
  displayGroupedMinterms() {
    if (this.isTautology) {
      return "This is a tautology (always true). No grouping needed.";
    }
    
    const groups = this.simplification[0];
    let output = '';

    output += `Original minterms: ${this.originalMinterms.join(', ')}\n`;
    output += `Using complement (maxterms): ${this.mintermsDecimal.join(', ')}\n\n`;

    for (let i = 0; i < groups.length; i++) {
      if (groups[i].length > 0) {
        output += `Group ${i} (${i} ones):\n`;
        for (const m of groups[i]) {
          output += `  ${m.getValue()} = ${m.getBinaryRepresentation()}\n`;
        }
        output += '\n';
      }
    }

    return output;
  }

  /**
   *Displays the process of combining terms throughout iterations.
   *@returns {string} Formatted output of the term combinations.
   */
  displayCombiningTerms() {
    if (this.isTautology) {
      return "This is a tautology (always true). No term combinations needed.";
    }
    
    let output = '';
    
    for (let iter = 1; iter < this.simplification.length; iter++) {
      const stepGroups = this.simplification[iter];
      output += `Iteration ${iter}:\n`;
      
      let hasGroups = false;
      for (let i = 0; i < stepGroups.length; i++) {
        if (stepGroups[i].length > 0) {
          hasGroups = true;
          output += `  Group ${i}:\n`;
          for (const m of stepGroups[i]) {
            output += `    ${m.getBinaryRepresentation()} (from: ${[...m.getSetOfMinterms()].sort((a, b) => a - b).join(', ')})\n`;
          }
          output += '\n';
        }
      }
      
      if (!hasGroups) {
        output += "No more possible pairings\n";
      }
    }

    output += "Prime Implicants:\n";
    for (const pi of this.primeImplicants) {
      output += `  ${pi.getBinaryRepresentation()} = ${this.mintermToPOSExpression(pi)} (covers: ${[...pi.getSetOfMinterms()].sort((a, b) => a - b).join(', ')})\n`;
    }

    return output;
  }

  /**
   *Returns the prime implicant table display.
   *@returns {string} Formatted prime implicant table.
   */
  displayPrimeImplicantsTable() {
    return this.primeImplicantTableDisplay;
  }

  /**
   *Returns the essential prime implicants table display.
   *@returns {string} Formatted essential prime implicants information.
   */
  displayEssentialPrimeImplicantsTable() {
    return this.essentialPrimeImplicantsDisplay;
  }

  /**
   *Generates the final Product of Sums (POS) expression.
   *@returns {string} The simplified POS expression.
   */
  getPOS() {
    if (this.isTautology) {
      return "POS Expression: 1 (Tautology - always true)";
    }
    
    if (this.essentialPrimeImplicants.length === 0) {
      //If there are no essential prime implicants but we have minterms,
      return "No essential prime implicants";
    }

    let posExpression = "POS Expression: ";
    let firstClause = true;

    for (const epi of this.essentialPrimeImplicants) {
      if (!firstClause) {
        posExpression += " · ";  //Product symbol
      } else {
        firstClause = false;
      }

      posExpression += this.mintermToPOSExpression(epi);
    }

    return posExpression;
  }
}