import React, { useState, useEffect, useRef } from 'react';
import './Electionday10.css';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // plugin function

const StatBox = ({ title, stats }) => {
    // This component remains the same
    const votedCount = parseInt(stats.voted) || 0;
    const nonVotedCount = parseInt(stats.non_voted) || 0;
    const total = votedCount + nonVotedCount;
    const percentage = total > 0 ? (votedCount / total) * 100 : 0;
    const boxClass = title === 'ALL ISLAND' ? 'stat-box-large' : 'stat-box-small';

    return (
        <div className={boxClass}>
            <h3>{title}</h3>
            <div className="stat-item">
                <span>Voted:</span>
                <span className="stat-value">{votedCount.toLocaleString()}</span>
            </div>
            <div className="stat-item">
                <span>Non-Voted:</span>
                <span className="stat-value">{nonVotedCount.toLocaleString()}</span>
            </div>
            <div className="stat-item">
                <span>Voted %:</span>
                <div className="progress-bar-container">
                    <div 
                        className="progress-bar" 
                        style={{ width: `${percentage}%` }}
                    >
                        {percentage.toFixed(1)}%
                    </div>
                </div>
            </div>
        </div>
    );
};


export default function Electionday10() {
  const [electoralStats, setElectoralStats] = useState([]);
  const [islandStats, setIslandStats] = useState({ voted: 0, non_voted: 0 });
  const dashboardRef = useRef(null);

  useEffect(() => {
    fetch('http://10.114.247.23/PROJECT/backend/api/admin/view_vote.php')
      .then(response => response.json())
      .then(data => {
        if (data.data) {
          setElectoralStats(data.data);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    if (electoralStats.length > 0) {
      const totals = electoralStats.reduce((accumulator, current) => {
        accumulator.voted += parseInt(current.voted) || 0;
        accumulator.non_voted += parseInt(current.non_voted) || 0;
        return accumulator;
      }, { voted: 0, non_voted: 0 });
      setIslandStats(totals);
    }
  }, [electoralStats]);

  const handlePrint = () => {
  const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Official Election Results", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Report generated on: ${new Date().toLocaleString()}`, 14, 29);
    
    const totalVotes = islandStats.voted + islandStats.non_voted;
    const overallPercentage = totalVotes > 0 ? (islandStats.voted / totalVotes) * 100 : 0;
    
    doc.setFontSize(12);
    doc.text("ALL ISLAND SUMMARY", 14, 45);
    
    // CHANGE: Call autoTable as a function, passing 'doc' to it
    autoTable(doc, {
        startY: 50,
        head: [['Total Voted', 'Total Non-Voted', 'Overall Voted %']],
        body: [[
            islandStats.voted.toLocaleString(),
            islandStats.non_voted.toLocaleString(),
            `${overallPercentage.toFixed(2)}%`
        ]],
        theme: 'striped',
        headStyles: { fillColor: [22, 160, 133] }
    });

    const tableColumn = ["Electoral Division", "Voted", "Non-Voted", "Voted %"];
    const tableRows = electoralStats.map(stat => {
        const total = (parseInt(stat.voted) || 0) + (parseInt(stat.non_voted) || 0);
        const percentage = total > 0 ? ((parseInt(stat.voted) || 0) / total) * 100 : 0;
        return [
            stat.Electoral_Division,
            (parseInt(stat.voted) || 0).toLocaleString(),
            (parseInt(stat.non_voted) || 0).toLocaleString(),
            `${percentage.toFixed(2)}%`
        ];
    });

    // CHANGE: Call the second table the same way
    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: doc.lastAutoTable.finalY + 15,
        headStyles: { fillColor: [44, 62, 80] }
    });
    
    doc.autoPrint();
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = doc.output('bloburl');
    document.body.appendChild(iframe);
    iframe.contentWindow.print();
  };


  return (
    <div className="live-dashboard-container" ref={dashboardRef}>
      <header className="dashboard-header">
        <button onClick={handlePrint} className="print-button">
          Print Results
        </button>
        <h1>Election Commission</h1>
      </header>
      
      <main className="dashboard-main">
        <StatBox title="ALL ISLAND" stats={islandStats} />
        
        <h2 className="division-title">ELECTORAL DIVISION</h2>
        
        <div className="division-grid">
          {electoralStats.map(stat => (
            <StatBox 
                key={stat.Electoral_Division} 
                title={stat.Electoral_Division} 
                stats={stat} 
            />
          ))}
        </div>
      </main>
    </div>
  );
}