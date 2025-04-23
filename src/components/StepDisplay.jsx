import React from 'react';

const StepDisplay = ({ step, data }) => {
  if (!data) return (
    <div className="no-data-message">No data available for this step</div>
  );

  switch (step) {
    case 'group-minterms':
      return <GroupedMintermsDisplay data={data} />;
    case 'prime-implicants':
      return <PrimeImplicantsDisplay data={data} />;
    case 'essential-implicants':
      return <EssentialImplicantsDisplay data={data} />;
    default:
      return (
        <div className="code-block">
          <pre>{typeof data === 'string' ? data : JSON.stringify(data, null, 2)}</pre>
        </div>
      );
  }
};

const GroupedMintermsDisplay = ({ data }) => {
  const groupedData = typeof data === 'string' ? parseGroupedMinterms(data) : data;
  
  if (!groupedData || (groupedData.groups && groupedData.groups.length === 0)) {
    return <div className="no-data-message">No grouped minterms to display</div>;
  }

  return (
    <div className="grouped-minterms-container">
      <div className="original-minterms-info">
        <h3 className="info-header">Original Information</h3>
        {groupedData.info && groupedData.info.map((line, idx) => (
          <p key={idx} className="info-line">{line}</p>
        ))}
      </div>
      
      <div className="minterm-groups-grid">
        {groupedData.groups && groupedData.groups.map((group, index) => (
          group.minterms && group.minterms.length > 0 && (
            <div key={index} className="minterm-group-card">
              <h3 className="group-title">Group {group.groupNumber} (with {group.groupNumber} 1's)</h3>
              <div className="minterms-list">
                {group.minterms.map((minterm, mIdx) => (
                  <div key={mIdx} className="minterm-item">
                    <span className="binary-rep">{minterm.binary}</span>
                    <span className="decimal-value">= {minterm.decimal}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

const PrimeImplicantsDisplay = ({ data }) => {
  const iterations = typeof data === 'string' ? parseCombiningTerms(data) : data;
  
  if (!iterations || iterations.length === 0) {
    return <div className="no-data-message">No prime implicants to display</div>;
  }

  return (
    <div className="prime-implicants-container">
      {iterations.map((iteration, idx) => (
        <div key={idx} className="iteration-section">
          <h3 className="iteration-title">{iteration.title}</h3>
          
          {iteration.groups && iteration.groups.length > 0 ? (
            <div className="table-container">
              <table className="iteration-table">
                <thead>
                  <tr>
                    <th>Group</th>
                    <th>Binary</th>
                    <th>Minterms</th>
                  </tr>
                </thead>
                <tbody>
                  {iteration.groups.map((group, groupIdx) => (
                    group.terms && group.terms.length > 0 && (
                      group.terms.map((term, termIdx) => (
                        <tr key={`${groupIdx}-${termIdx}`} className={termIdx === 0 ? "group-start" : ""}>
                          {termIdx === 0 && (
                            <td rowSpan={group.terms.length} className="group-cell">
                              {group.title.replace('Group ', '')}
                            </td>
                          )}
                          <td className="binary-cell">{term.binary}</td>
                          <td className="minterms-cell">{term.minterms}</td>
                        </tr>
                      ))
                    )
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-groups-message">{iteration.message || "No more possible pairings"}</p>
          )}
        </div>
      ))}
      
      {iterations[iterations.length - 1]?.primeImplicants && (
        <div className="prime-implicants-section">
          <h3 className="section-subtitle">Prime Implicants</h3>
          <div className="table-container">
            <table className="prime-implicants-table">
              <thead>
                <tr>
                  <th>Binary</th>
                  <th>Expression</th>
                  <th>Covers</th>
                </tr>
              </thead>
              <tbody>
                {iterations[iterations.length - 1].primeImplicants.map((pi, idx) => (
                  <tr key={idx} className="prime-implicant-row">
                    <td className="pi-binary-cell">{pi.binary}</td>
                    <td className="pi-expression-cell">{pi.expression}</td>
                    <td className="pi-covers-cell">{pi.covers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const EssentialImplicantsDisplay = ({ data }) => {
  const essentialPIs = typeof data === 'string' ? parseEssentialPrimeImplicants(data) : data;
  
  if (!essentialPIs) {
    return <div className="no-data-message">No essential prime implicants to display</div>;
  }

  return (
    <div className="essential-pi-container">
      <div className="essential-section">
        <h3 className="section-subtitle">Essential Prime Implicants</h3>
        
        {essentialPIs.essential && essentialPIs.essential.length > 0 ? (
          <div className="table-container">
            <table className="essential-pi-table">
              <thead>
                <tr>
                  <th>Expression</th>
                </tr>
              </thead>
              <tbody>
                {essentialPIs.essential.map((epi, idx) => (
                  <tr key={idx}>
                    <td className="epi-expression-cell">{epi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-epi-message no-data-message">No essential prime implicants found</p>
        )}
      </div>
      
      {essentialPIs.uncovered && essentialPIs.uncovered.length > 0 && (
        <div className="uncovered-section">
          <h4 className="uncovered-title">Uncovered Minterms</h4>
          <div className="uncovered-minterms">{essentialPIs.uncovered.join(', ')}</div>
        </div>
      )}
      
      {essentialPIs.additional && essentialPIs.additional.length > 0 && (
        <div className="additional-section">
          <h4 className="additional-title">Additional Prime Implicants</h4>
          <div className="table-container">
            <table className="additional-pi-table">
              <thead>
                <tr>
                  <th>Expression</th>
                </tr>
              </thead>
              <tbody>
                {essentialPIs.additional.map((pi, idx) => (
                  <tr key={idx}>
                    <td className="api-expression-cell">{pi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="final-pi-section">
        <h3 className="final-pi-title">Final Prime Implicants</h3>
        <div className="table-container">
          <table className="final-pi-table">
            <thead>
              <tr>
                <th>Expression</th>
              </tr>
            </thead>
            <tbody>
              {essentialPIs.final && essentialPIs.final.map((pi, idx) => (
                <tr key={idx}>
                  <td className="final-pi-expression-cell">{pi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

function parseGroupedMinterms(data) {
  if (!data) return null;
  
  const lines = data.split('\n');
  const info = [];
  const groups = [];
  
  let currentGroup = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('Original') || line.startsWith('Using')) {
      info.push(line);
    } else if (line.startsWith('Group')) {
      const groupMatch = line.match(/Group (\d+)/);
      if (groupMatch) {
        const groupNumber = parseInt(groupMatch[1]);
        currentGroup = { groupNumber, minterms: [] };
        groups[groupNumber] = currentGroup;
      }
    } else if (line.match(/^\d+/) && currentGroup) {
      const mintermMatch = line.match(/(\d+)\s*=\s*([01]+)/);
      if (mintermMatch) {
        currentGroup.minterms.push({
          decimal: parseInt(mintermMatch[1]),
          binary: mintermMatch[2]
        });
      }
    }
  }
  
  return { info, groups };
}

function parseCombiningTerms(data) {
  if (!data) return null;
  
  const lines = data.split('\n');
  const iterations = [];
  
  let currentIteration = null;
  let currentGroup = null;
  let isPrimeImplicantsSection = false;
  let primeImplicants = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('Iteration')) {
      const iterMatch = line.match(/Iteration (\d+)/);
      if (iterMatch) {
        currentIteration = { 
          title: line, 
          groups: [],
          message: null 
        };
        iterations.push(currentIteration);
        currentGroup = null;
      }
    } else if (line.startsWith('Group') && currentIteration) {
      const groupMatch = line.match(/Group (\d+)/);
      if (groupMatch) {
        currentGroup = { title: line, terms: [] };
        currentIteration.groups.push(currentGroup);
      }
    } else if (line === 'No more possible pairings' && currentIteration) {
      currentIteration.message = line;
    } else if (line.startsWith('Prime Implicants:')) {
      isPrimeImplicantsSection = true;
      currentIteration = null;
      currentGroup = null;
    } else if (isPrimeImplicantsSection && line.match(/^\s*[01/-]+/)) {
      const piMatch = line.match(/([01/-]+)\s*=\s*(\([^)]+\))\s*\(covers:\s*([^)]+)\)/);
      if (piMatch) {
        primeImplicants.push({
          binary: piMatch[1],
          expression: piMatch[2],
          covers: piMatch[3]
        });
      }
    } else if (currentGroup && line.match(/[01/-]+/)) {
      const termMatch = line.match(/([01/-]+)\s*\(from:\s*([^)]+)\)/);
      if (termMatch) {
        currentGroup.terms.push({
          binary: termMatch[1],
          minterms: termMatch[2]
        });
      }
    }
  }
  
  if (iterations.length > 0) {
    iterations[iterations.length - 1].primeImplicants = primeImplicants;
  }
  
  return iterations;
}

function parseEssentialPrimeImplicants(data) {
  if (!data) return null;
  
  const lines = data.split('\n');
  const essentialPIs = {
    essential: [],
    uncovered: [],
    additional: [],
    final: []
  };
  
  let section = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line === 'Essential Prime Implicants:') {
      section = 'essential';
    } else if (line.startsWith('Not all minterms are covered')) {
      section = 'uncovered';
    } else if (line.startsWith('Uncovered minterms:')) {
      const uncoveredMatch = line.match(/Uncovered minterms:\s*(.+)/);
      if (uncoveredMatch) {
        essentialPIs.uncovered = uncoveredMatch[1].split(', ').map(m => m.trim());
      }
    } else if (line.startsWith('Added additional prime implicant:')) {
      const additionalMatch = line.match(/Added additional prime implicant:\s*(.+)/);
      if (additionalMatch) {
        essentialPIs.additional.push(additionalMatch[1]);
      }
    } else if (line === 'Final Prime Implicants:') {
      section = 'final';
    } else if (line.startsWith('-') && section === 'essential') {
      const pi = line.substring(2).trim();
      essentialPIs.essential.push(pi);
    } else if (line.startsWith('-') && section === 'final') {
      const pi = line.substring(2).trim();
      essentialPIs.final.push(pi);
    }
  }
  
  return essentialPIs;
}

export default StepDisplay;