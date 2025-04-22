import Minterm from './Minterm';

export default class QuineMcCluskeyAlgorithm {
  constructor(mintermsDecimal, variablesLetter) {
    this.mintermsDecimal = [...mintermsDecimal];
    this.variablesLetter = variablesLetter;
    this.numberOfVariables = variablesLetter.length;
    this.mintermList = [];
    this.simplification = [];
    this.primeImplicants = [];
    this.essentialPrimeImplicants = [];
    this.simplificationDisplay = '';
    this.primeImplicantTableDisplay = '';
    this.essentialPrimeImplicantsDisplay = '';

    // Convert decimal minterms to binary representation
    for (const m of mintermsDecimal) {
      this.mintermList.push(new Minterm(m, this.numberOfVariables));
    }
  }

  solve() {
    // Step 1: Group by ones
    const groups = this.groupByOnes();

    // Step 2: Find prime implicants
    this.findPrimeImplicants(groups);

    // Step 3: Create prime implicant table
    this.createPrimeImplicantTable();

    // Step 4: Find essential prime implicants
    this.findEssentialPrimeImplicants();
  }

  groupByOnes() {
    const groups = Array(this.numberOfVariables + 1).fill().map(() => []);

    for (const m of this.mintermList) {
      const groupNumber = m.countNumberOfOnes();
      groups[groupNumber].push(m);
    }

    return groups;
  }

  findPrimeImplicants(groups) {
    let currentGroups = groups;
    this.simplification.push(currentGroups.map(group => [...group]));

    while (true) {
      const newGroups = [];
      let hasCombinations = false;

      for (let i = 0; i < currentGroups.length - 1; i++) {
        const currentGroup = currentGroups[i];
        const nextGroup = currentGroups[i + 1];

        if (currentGroup.length === 0 || nextGroup.length === 0) {
          newGroups.push([]);
          continue;
        }

        const combinedGroup = [];
        const combinedMinterms = new Set();

        for (const minterm1 of currentGroup) {
          for (const minterm2 of nextGroup) {
            const { success, minterm } = minterm1.combineMinterms(minterm2);
            if (success) {
              hasCombinations = true;
              combinedMinterms.add(minterm1);
              combinedMinterms.add(minterm2);

              // Check if term already exists
              const existing = combinedGroup.find(m => m.equals(minterm));
              if (existing) {
                minterm.getSetOfMinterms().forEach(m => existing.getSetOfMinterms().add(m));
              } else {
                combinedGroup.push(minterm);
              }
            }
          }
        }

        // Add uncombined minterms as prime implicants
        for (const minterm of currentGroup) {
          if (!combinedMinterms.has(minterm)) {
            this.primeImplicants.push(minterm);
          }
        }

        // Check last group
        if (i === currentGroups.length - 2) {
          for (const minterm of nextGroup) {
            if (!combinedMinterms.has(minterm)) {
              this.primeImplicants.push(minterm);
            }
          }
        }

        newGroups.push(combinedGroup);
      }

      if (!hasCombinations) break;

      currentGroups = newGroups;
      this.simplification.push(currentGroups.map(group => [...group]));
    }

    // Remove duplicates from prime implicants
    this.primeImplicants = this.primeImplicants.filter(
      (m, i, self) => i === self.findIndex(mm => mm.equals(m))
    );
  }

  createPrimeImplicantTable() {
    let table = `Prime Implicant        | `;
    table += this.mintermsDecimal.map(m => m.toString().padEnd(4)).join('');
    table += '\n';
    table += '-'.repeat(22) + '-|-' + '-'.repeat(this.mintermsDecimal.length * 4) + '\n';

    for (const pi of this.primeImplicants) {
      const expr = pi.mintermToExpression(this.variablesLetter);
      table += expr.padEnd(22) + ' | ';
      
      for (const m of this.mintermsDecimal) {
        table += (pi.doesItMatch(m) ? 'X' : '').padEnd(4);
      }
      table += '\n';
    }

    this.primeImplicantTableDisplay = table;
  }

  getPrimeImplicantTableData() {
    return this.primeImplicants.map(pi => ({
      expression: pi.mintermToExpression(this.variablesLetter),
      minterms: [...pi.getSetOfMinterms()]
    }));
  }

  findEssentialPrimeImplicants() {
    const coverageMap = new Map();
    for (const m of this.mintermsDecimal) {
      coverageMap.set(m, []);
    }

    // Find which prime implicants cover each minterm
    for (const pi of this.primeImplicants) {
      for (const m of this.mintermsDecimal) {
        if (pi.doesItMatch(m)) {
          coverageMap.get(m).push(pi);
        }
      }
    }

    const coveredMinterms = new Set();

    // Find essential PIs (columns with only one X)
    for (const [m, pis] of coverageMap.entries()) {
      if (pis.length === 1) {
        const epi = pis[0];
        if (!this.essentialPrimeImplicants.some(e => e.equals(epi))) {
          this.essentialPrimeImplicants.push(epi);
          
          // Add all minterms covered by this EPI
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
        display += `- ${epi.mintermToExpression(this.variablesLetter)}\n`;
      }
    }

    // Handle uncovered minterms
    const uncovered = this.mintermsDecimal.filter(m => !coveredMinterms.has(m));
    if (uncovered.length > 0) {
      display += `\nNot all minterms are covered by essential prime implicants\n`;
      display += `Uncovered minterms: ${uncovered.join(', ')}\n`;

      // Add additional PIs to cover remaining minterms
      let remainingUncovered = [...uncovered];
      while (remainingUncovered.length > 0) {
        let bestPi = null;
        let maxCoverage = 0;

        // Find PI that covers most uncovered minterms
        for (const pi of this.primeImplicants) {
          if (this.essentialPrimeImplicants.some(e => e.equals(pi))) continue;
          
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
          display += `Added additional prime implicant: ${bestPi.mintermToExpression(this.variablesLetter)}\n`;
          
          // Remove covered minterms
          remainingUncovered = remainingUncovered.filter(m => !bestPi.doesItMatch(m));
        } else {
          break;
        }
      }
    }

    display += "\nFinal Prime Implicants:\n";
    for (const pi of this.essentialPrimeImplicants) {
      display += `- ${pi.mintermToExpression(this.variablesLetter)}\n`;
    }

    this.essentialPrimeImplicantsDisplay = display;
  }

  displayGroupedMinterms() {
    const groups = this.simplification[0];
    let output = '';

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
            output += `    ${m.getBinaryRepresentation()} (from: ${[...m.getSetOfMinterms()].join(', ')})\n`;
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
      output += `  ${pi.getBinaryRepresentation()} = ${pi.mintermToExpression(this.variablesLetter)} (covers: ${[...pi.getSetOfMinterms()].join(', ')})\n`;
    }

    return output;
  }

  displayPrimeImplicantsTable() {
    return this.primeImplicantTableDisplay;
  }

  displayEssentialPrimeImplicantsTable() {
    return this.essentialPrimeImplicantsDisplay;
  }

  getPOS() {
    if (this.essentialPrimeImplicants.length === 0) {
      return "No essential prime implicants";
    }

    // Get maxterms (minterms not in the original list)
    const possibleMinterms = 1 << this.numberOfVariables;
    const maxterms = [];
    for (let i = 0; i < possibleMinterms; i++) {
      if (!this.mintermsDecimal.includes(i)) {
        maxterms.push(i);
      }
    }

    if (maxterms.length === 0) {
      return "No maxterms found";
    }

    let posExpression = "POS Expression: ";
    let firstPi = true;

    for (const epi of this.essentialPrimeImplicants) {
      if (!firstPi) {
        posExpression += " * ";
      } else {
        firstPi = false;
      }

      posExpression += "(";
      let firstVar = true;
      const binRep = epi.getBinaryRepresentation();

      for (let i = 0; i < binRep.length; i++) {
        const bit = binRep.charAt(i);
        if (bit !== '-') {
          if (!firstVar) {
            posExpression += " + ";
          } else {
            firstVar = false;
          }

          const varName = this.variablesLetter.charAt(i);
          posExpression += bit === '1' ? `${varName}'` : varName;
        }
      }

      posExpression += ")";
    }

    return posExpression;
  }
}