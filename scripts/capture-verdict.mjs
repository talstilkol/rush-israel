/** Capture/cleanup are mandatory before a measured verdict may become green. */
export async function captureWithVerdict(summary,{capture,persist,cleanup}){
 const checksPassed=summary.passed===true&&!summary.error&&!summary.cleanupError;
 summary.passed=false;summary.captureStatus='pending';await persist(summary);
 let failure;
 try{await capture();summary.captureStatus='captured'}catch(error){failure=error;summary.captureStatus='failed'}
 try{if(cleanup)await cleanup()}catch(error){summary.cleanupError=String(error);if(!failure)failure=error}
 if(failure){summary.passed=false;summary.error=String(failure);await persist(summary);throw failure}
 summary.passed=checksPassed;await persist(summary);return summary;
}
