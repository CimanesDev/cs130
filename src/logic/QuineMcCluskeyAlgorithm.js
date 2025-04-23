/**
 *Implementation of the Quine-McCluskey algorithm for finding minimal Product of Sums (POS)
 *Boolean expressions from a set of maxterms (or complement of minterms).
 *This implementation finds the minimal POS form using essential prime implicants.
 */
import Minterm from './Minterm';

export default class QuineMcCluskeyAlgorithm {
  /**
   *Creates a new instance of the Quine-McCluskey algorithm.
   *@param {number[]} mintermsDecimal - Array of decimal minterms
   *@param {string} variablesLetter - String of variable letters (e.g., "ABCD")
   */
  constructor(mintermsDecimal, variablesLetter) {
    //Store original minterms
    this.originalMinterms = [...mintermsDecimal];
    this.variablesLetter = variablesLetter;
    this.numberOfVariables = variablesLetter.length;
    
    //Generate the complement of the minterms (maxterms)
    this.mintermsDecimal = this.generateComplement(mintermsDecimal);
    
    //Initialize data structures
    this.mintermList = [];
    this.simplification = []; //Holds intermediate steps of the algorithm
    this.primeImplicants = [];
    this.essentialPrimeImplicants = [];
    this.simplificationDisplay = '';
    this.primeImplicantTableDisplay = '';
    this.essentialPrimeImplicantsDisplay = '';

    //Convert decimal minterms to binary representation
    for (const m of this.mintermsDecimal) {
      this.mintermList.push(new Minterm(m, this.numberOfVariables));
    }
  }

  /**
   *Generate the complement of the given minterms (finds maxterms).
   *@param {number[]} minterms - Array of decimal minterms
   *@returns {number[]} Array of decimal maxterms
   */
  generateComplement(minterms) {
    const totalPossibleMinterms = 1 << this.numberOfVariables; // 2^n
    const complement = [];
    
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
    //Step 1: Group minterms by number of ones in binary representation
    const groups = this.groupByOnes();

    //Step 2: Find prime implicants through iterative combining
    this.findPrimeImplicants(groups);

    //Step 3: Create prime implicant table for visualization
    this.createPrimeImplicantTable();

    //Step 4: Find essential prime implicants to build minimal expression
    this.findEssentialPrimeImplicants();
  }

  /**
   *Groups minterms by the number of '1' bits in their binary representation.
   *@returns {Array<Array<Minterm>>} Array of groups, where each group contains minterms with same number of ones
   */
  groupByOnes() {
    const groups = Array(this.numberOfVariables + 1).fill().map(() => []);

    for (const m of this.mintermList) {
      const groupNumber = m.countNumberOfOnes();
      groups[groupNumber].push(m);
    }

    return groups;
  }

  /**
   *Find prime implicants by iteratively combining minterms.
   *Prime implicants are minterms that cannot be combined further.
   *@param {Array<Array<Minterm>>} groups - Initial groups of minterms
   */
  findPrimeImplicants(groups) {
    let currentGroups = groups;
    this.simplification.push(currentGroups.map(group => [...group]));
    
    //Track all terms for later verification
    const allTerms = new Set();
    this.mintermList.forEach(m => allTerms.add(m));

    while (true) {
      const newGroups = [];
      let hasCombinations = false;
      
      //Track which terms were combined in this iteration
      const combinedTerms = new Set();

      for (let i = 0; i < currentGroups.length - 1; i++) {
        const currentGroup = currentGroups[i];
        const nextGroup = currentGroups[i + 1];

        if (currentGroup.length === 0 || nextGroup.length === 0) {
          newGroups.push([]);
          continue;
        }

        const combinedGroup = [];

        //Try to combine minterms from adjacent groups
        for (const minterm1 of currentGroup) {
          for (const minterm2 of nextGroup) {
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
                minterm.getSetOfMinterms().forEach(m => existing.getSetOfMinterms().add(m));
              } else {
                combinedGroup.push(minterm);
              }
            }
          }
        }

        newGroups.push(combinedGroup);
      }

      //Find terms that weren't combined in this iteration
      //These become prime implicants
      if (currentGroups.length > 0) {
        for (const group of currentGroups) {
          for (const term of group) {
            if (!combinedTerms.has(term)) {
              this.primeImplicants.push(term);
            }
          }
        }
      }

      //If no combinations were made, we're done
      if (!hasCombinations) break;

      currentGroups = newGroups;
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
   *Creates a visual table showing which minterms are covered by which prime implicants.
   */
  createPrimeImplicantTable() {
    let table = `Prime Implicant        | `;
    table += this.mintermsDecimal.map(m => m.toString().padEnd(4)).join('');
    table += '\n';
    table += '-'.repeat(22) + '-|-' + '-'.repeat(this.mintermsDecimal.length * 4) + '\n';

    for (const pi of this.primeImplicants) {
      //Convert the prime implicant to a POS term
      const expr = this.mintermToPOSExpression(pi);
      table += expr.padEnd(22) + ' | ';
      
      for (const m of this.mintermsDecimal) {
        table += (pi.doesItMatch(m) ? 'X' : '').padEnd(4);
      }
      table += '\n';
    }

    this.primeImplicantTableDisplay = table;
  }

  /**
   *Returns structured data for the prime implicant table.
   *@returns {Object} Object containing prime implicants and minterms data
   */
  getPrimeImplicantTableData() {
    return {
      primeImplicants: this.primeImplicants.map(pi => ({
        expression: this.mintermToPOSExpression(pi),
        minterms: [...pi.getSetOfMinterms()]
      })),
      minterms: this.mintermsDecimal
    };
  }

  /**
   *Convert a minterm to POS expression for display in the table.
   *@param {Minterm} minterm - The minterm to convert
   *@returns {string} POS expression representation
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
   *Finds essential prime implicants and additional prime implicants 
   *needed for a minimal POS expression.
   */
  findEssentialPrimeImplicants() {
    //Create map to track which prime implicants cover each minterm
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
          
          //Add all minterms covered by this EPI to the covered set
          for (const cm of this.mintermsDecimal) {
            if (epi.doesItMatch(cm)) {
              coveredMinterms.add(cm);
            }
          }
        }
      }
    }
  
    //Create display string
    let display = "Essential Prime Implicants:\n";
    if (this.essentialPrimeImplicants.length === 0) {
      display += "No essential prime implicants found\n";
    } else {
      for (const epi of this.essentialPrimeImplicants) {
        display += `- ${this.mintermToPOSExpression(epi)}\n`;
      }
    }
  
    //Handle uncovered minterms using a greedy approach
    const uncovered = this.mintermsDecimal.filter(m => !coveredMinterms.has(m));
    if (uncovered.length > 0) {
      display += `\nNot all minterms are covered by essential prime implicants\n`;
      display += `Uncovered minterms: ${uncovered.join(', ')}\n`;
  
      //Add additional PIs to cover remaining minterms
      let remainingUncovered = [...uncovered];
      while (remainingUncovered.length > 0) {
        let bestPi = null;
        let maxCoverage = 0;
  
        //Find PI that covers most uncovered minterms (greedy approach)
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
          
          //Remove newly covered minterms
          remainingUncovered = remainingUncovered.filter(m => !bestPi.doesItMatch(m));
        } else {
          break; //No more coverage possible
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
   *Displays the initial grouping of minterms by number of ones.
   *@returns {string} Formatted display of grouped minterms
   */
  displayGroupedMinterms() {
    const groups = this.simplification[0];
    let output = '';

    output += `Original minterms: ${this.originalMinterms.join(', ')}\n`;
    output += `Using complement: ${this.mintermsDecimal.join(', ')}\n\n`;

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
   *Displays the process of combining terms through iterations.
   *@returns {string} Formatted display of term combinations
   */
  displayCombiningTerms() {
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
   *Returns the prime implicant table as a string.
   *@returns {string} Formatted prime implicant table
   */
  displayPrimeImplicantsTable() {
    return this.primeImplicantTableDisplay;
  }

  /**
   *Returns the essential prime implicants table as a string.
   *@returns {string} Formatted essential prime implicants info
   */
  displayEssentialPrimeImplicantsTable() {
    return this.essentialPrimeImplicantsDisplay;
  }

  /**
   *Gets the final minimal Product of Sums (POS) expression.
   *@returns {string} Minimal POS expression
   */
  getPOS() {
    if (this.essentialPrimeImplicants.length === 0) {
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