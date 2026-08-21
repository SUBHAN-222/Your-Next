const fs = require('fs');

let content = fs.readFileSync('src/data/questions.js', 'utf8');

// Update TOTAL_STEPS
content = content.replace('export const TOTAL_STEPS = 6', 'export const TOTAL_STEPS = 7');

// Update answers indexing
content = content.replace('const q1 = answers[1]?.val', 'const q1 = answers[2]?.val');
content = content.replace('const q2 = answers[2]?.val', 'const q2 = answers[3]?.val');
content = content.replace('const q3 = answers[3]?.val', 'const q3 = answers[4]?.val');
content = content.replace('const q4 = answers[4]?.val', 'const q4 = answers[5]?.val');

// Shift step numbers in if statements
// Because there are multiple instances of these `if (currentStep === X)`, we will use regex with global flag `g`
content = content.replace(/if \(currentStep === 5\)/g, 'if (currentStep === 6)');
content = content.replace(/if \(currentStep === 4\)/g, 'if (currentStep === 5)');
content = content.replace(/if \(currentStep === 3\)/g, 'if (currentStep === 4)');
content = content.replace(/if \(currentStep === 2\)/g, 'if (currentStep === 3)');
content = content.replace(/if \(currentStep === 1\)/g, 'if (currentStep === 2)');

// Shift STEP comments
content = content.replace(/STEP 5/g, 'STEP 6');
content = content.replace(/STEP 4/g, 'STEP 5');
content = content.replace(/STEP 3/g, 'STEP 4');
content = content.replace(/STEP 2/g, 'STEP 3');
content = content.replace(/STEP 1/g, 'STEP 2');

// Insert new step 1
const newStep1 = `  // ── STEP 1: AI Help Question (Asked to all) ──
  if (currentStep === 1) {
    return {
      id: "q_ai_help",
      eye: "Using tools",
      title: "Have you already tried asking AI tools like ChatGPT for help with this?",
      hint: "This helps us understand how you currently solve problems.",
      opts: [
        { e: "🌊", l: "Yes, but it gave me too many options and I got overwhelmed", val: "ai_overwhelmed" },
        { e: "🤷", l: "Yes, but I still didn't know what to actually DO next", val: "ai_no_action" },
        { e: "👍", l: "Yes, it helped a little", val: "ai_helped_some" },
        { e: "❌", l: "No, haven't tried that yet", val: "ai_not_tried" }
      ]
    }
  }

  // ── STEP 2`;
content = content.replace('  // ── STEP 2', newStep1);

// Text replacements
content = content.replace(
  'title: "Be honest — how stuck are you with actual code?"', 
  'title: "When you try to write code, what actually happens — you freeze up, copy from somewhere, or don\'t even open the editor?"'
);
content = content.replace(
  'title: "Be honest — how\'s your relationship with math?"', 
  'title: "When you see an equation, what\'s your first reaction — curiosity, dread, or \'skip to the next slide\'?"'
);
content = content.replace(
  'title: "How comfortable are you with numbers?"', 
  'title: "When you look at a spreadsheet full of numbers, do you feel curious, or want to close the tab?"'
);
content = content.replace(
  'title: "How confident do you feel writing code?"', 
  'title: "If a coding assignment breaks, what do you usually do — debug it, ask someone, or give up for the day?"'
);

fs.writeFileSync('src/data/questions.js', content);
console.log('Update complete.');
