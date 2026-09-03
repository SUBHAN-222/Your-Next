/**
 * Builds surprise level checks from an objective beginner question bank.
 * Roadmap content is used only to detect the topics the learner has covered;
 * the questions themselves test knowledge rather than roadmap wording recall.
 */

export function randomCheckThreshold() {
  return 5 + Math.floor(Math.random() * 4) // 5–8, inclusive
}

export function shouldTriggerCheck(tasksSinceCheck, threshold) {
  return tasksSinceCheck >= threshold
}

function shuffle(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function uniqueBy(arr, key) {
  const seen = new Set()
  return arr.filter((item) => {
    const k = item[key]
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

const QUESTION_BANK = {
  html: [
    { question: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'], correctAnswer: 'Hyper Text Markup Language' },
    { question: 'Which HTML element creates the largest default heading?', options: ['<h1>', '<head>', '<heading>', '<h6>'], correctAnswer: '<h1>' },
    { question: 'Which HTML element creates a link to another page?', options: ['<a>', '<link>', '<nav>', '<href>'], correctAnswer: '<a>' },
    { question: 'What is the main purpose of the alt attribute on an image?', options: ['Describe the image when it cannot be seen', 'Resize the image', 'Link the image to another page', 'Add a caption below the image'], correctAnswer: 'Describe the image when it cannot be seen' },
    { question: 'Which HTML element represents the main navigation links?', options: ['<nav>', '<menuitem>', '<section>', '<aside>'], correctAnswer: '<nav>' },
    { question: 'Which HTML element is used for a paragraph?', options: ['<p>', '<text>', '<para>', '<span>'], correctAnswer: '<p>' },
  ],
  css: [
    { question: 'What is CSS mainly used for?', options: ['Styling and laying out web pages', 'Storing database records', 'Running server commands', 'Creating image files'], correctAnswer: 'Styling and laying out web pages' },
    { question: 'Which CSS selector targets an element with id="hero"?', options: ['#hero', '.hero', 'hero', '*hero'], correctAnswer: '#hero' },
    { question: 'Which CSS property changes text color?', options: ['color', 'font-color', 'text-style', 'foreground'], correctAnswer: 'color' },
    { question: 'What does margin control in the CSS box model?', options: ['Space outside an element border', 'Space between content and border', 'The border thickness', 'The text line height'], correctAnswer: 'Space outside an element border' },
    { question: 'Which CSS feature applies styles at different screen sizes?', options: ['Media queries', 'Keyframes', 'Pseudo-elements', 'Custom properties'], correctAnswer: 'Media queries' },
    { question: 'Which declaration turns an element into a flex container?', options: ['display: flex', 'position: flex', 'layout: flex', 'flex: display'], correctAnswer: 'display: flex' },
  ],
  javascript: [
    { question: 'Which JavaScript keyword declares a variable that cannot be reassigned?', options: ['const', 'let', 'var', 'static'], correctAnswer: 'const' },
    { question: 'Which operator checks both value and type equality in JavaScript?', options: ['===', '==', '=', '!='], correctAnswer: '===' },
    { question: 'Which method adds an item to the end of a JavaScript array?', options: ['push()', 'pop()', 'shift()', 'join()'], correctAnswer: 'push()' },
    { question: 'What does DOM stand for?', options: ['Document Object Model', 'Data Object Manager', 'Digital Output Method', 'Document Order Map'], correctAnswer: 'Document Object Model' },
    { question: 'Which method writes a message to the browser console?', options: ['console.log()', 'print.console()', 'browser.write()', 'log.output()'], correctAnswer: 'console.log()' },
    { question: 'Which value represents an intentional absence of an object value?', options: ['null', 'false', '0', 'NaN'], correctAnswer: 'null' },
  ],
  python: [
    { question: 'Which keyword defines a function in Python?', options: ['def', 'function', 'func', 'define'], correctAnswer: 'def' },
    { question: 'Which brackets create a Python list?', options: ['[]', '{}', '()', '<>'], correctAnswer: '[]' },
    { question: 'What does len("code") return in Python?', options: ['4', '3', '5', 'code'], correctAnswer: '4' },
    { question: 'How does Python mark a block of code?', options: ['Indentation', 'Curly braces', 'Square brackets', 'A begin keyword'], correctAnswer: 'Indentation' },
    { question: 'Which Python data type stores key-value pairs?', options: ['Dictionary', 'List', 'Tuple', 'String'], correctAnswer: 'Dictionary' },
    { question: 'Which keyword loads a module in Python?', options: ['import', 'include', 'using', 'require'], correctAnswer: 'import' },
  ],
  aiMl: [
    { question: 'What is training data used for in machine learning?', options: ['Helping a model learn patterns', 'Making a computer run faster', 'Encrypting model files', 'Designing the user interface'], correctAnswer: 'Helping a model learn patterns' },
    { question: 'In supervised learning, what does each training example usually include?', options: ['An input and a known answer', 'Only random numbers', 'A password and username', 'A web address and image'], correctAnswer: 'An input and a known answer' },
    { question: 'What is a machine learning model?', options: ['A learned pattern used to make predictions', 'A physical computer component', 'A database backup', 'A programming language'], correctAnswer: 'A learned pattern used to make predictions' },
    { question: 'What is overfitting?', options: ['Learning training data too closely and generalizing poorly', 'Training with too little computer memory', 'Making predictions too quickly', 'Using more than one input'], correctAnswer: 'Learning training data too closely and generalizing poorly' },
    { question: 'What is inference in AI?', options: ['Using a trained model to produce an output', 'Deleting incorrect training records', 'Writing the model source code', 'Connecting a model to the internet'], correctAnswer: 'Using a trained model to produce an output' },
    { question: 'Which task predicts a category such as spam or not spam?', options: ['Classification', 'Sorting', 'Compression', 'Rendering'], correctAnswer: 'Classification' },
  ],
  data: [
    { question: 'In a table, what does one row usually represent?', options: ['One record', 'One formula', 'One database', 'One chart'], correctAnswer: 'One record' },
    { question: 'What is the mean of 2, 4, and 6?', options: ['4', '3', '6', '12'], correctAnswer: '4' },
    { question: 'Which SQL keyword reads data from a table?', options: ['SELECT', 'UPDATE', 'DELETE', 'DROP'], correctAnswer: 'SELECT' },
    { question: 'What is a CSV file designed to store?', options: ['Tabular values separated by delimiters', 'Executable program instructions', 'Compressed video frames', 'Encrypted passwords'], correctAnswer: 'Tabular values separated by delimiters' },
    { question: 'Why should missing data be checked before analysis?', options: ['It can distort conclusions', 'It always speeds up calculations', 'It changes column names', 'It converts numbers to images'], correctAnswer: 'It can distort conclusions' },
    { question: 'Which chart is commonly used to compare values across categories?', options: ['Bar chart', 'Scatter plot', 'Histogram', 'Heat map'], correctAnswer: 'Bar chart' },
  ],
  cybersecurity: [
    { question: 'What is phishing?', options: ['A fake message designed to steal information', 'A method for compressing files', 'A secure login protocol', 'A type of software update'], correctAnswer: 'A fake message designed to steal information' },
    { question: 'Which password is generally strongest?', options: ['A long unique passphrase', 'password123', 'Your first name', 'The same password used everywhere'], correctAnswer: 'A long unique passphrase' },
    { question: 'What does multi-factor authentication add to a login?', options: ['Another independent proof of identity', 'A second username', 'A public password hint', 'Automatic file sharing'], correctAnswer: 'Another independent proof of identity' },
    { question: 'What does HTTPS protect while data travels between browser and website?', options: ['The connection with encryption', 'The screen brightness', 'The website domain name', 'The keyboard layout'], correctAnswer: 'The connection with encryption' },
    { question: 'What does the principle of least privilege mean?', options: ['Give only the access needed for a task', 'Give every user administrator access', 'Use the shortest possible password', 'Keep every file forever'], correctAnswer: 'Give only the access needed for a task' },
    { question: 'Why are security updates important?', options: ['They often fix known vulnerabilities', 'They remove the need for passwords', 'They guarantee faster internet', 'They make backups unnecessary'], correctAnswer: 'They often fix known vulnerabilities' },
  ],
  mobile: [
    { question: 'What is a native mobile app?', options: ['An app built for a specific mobile platform', 'A website saved as a bookmark', 'An app that needs no operating system', 'A desktop-only program'], correctAnswer: 'An app built for a specific mobile platform' },
    { question: 'Why should mobile touch targets be large enough?', options: ['So users can tap them accurately', 'So they use more battery', 'So pages need more scrolling', 'So text loads faster'], correctAnswer: 'So users can tap them accurately' },
    { question: 'What is an emulator used for in mobile development?', options: ['Running a simulated mobile device', 'Publishing an app automatically', 'Designing a database schema', 'Encrypting source code'], correctAnswer: 'Running a simulated mobile device' },
    { question: 'When should an app request a sensitive permission?', options: ['When the related feature needs it', 'Immediately on every launch', 'Only after the app crashes', 'Without explaining its purpose'], correctAnswer: 'When the related feature needs it' },
    { question: 'What does responsive design do?', options: ['Adapts a layout to different screen sizes', 'Makes every button animate', 'Stores data without a server', 'Converts an app to source code'], correctAnswer: 'Adapts a layout to different screen sizes' },
    { question: 'Why test a mobile app on real devices?', options: ['To catch hardware and environment differences', 'To avoid writing any tests', 'To remove all network requests', 'To replace the app store review'], correctAnswer: 'To catch hardware and environment differences' },
  ],
  web: [
    { question: 'What is the role of a web browser?', options: ['Request and display web content', 'Store every website database', 'Compile mobile apps', 'Create internet accounts'], correctAnswer: 'Request and display web content' },
    { question: 'What does HTTP define?', options: ['How web clients and servers exchange messages', 'How a keyboard sends keystrokes', 'How images choose their colors', 'How files are compressed'], correctAnswer: 'How web clients and servers exchange messages' },
    { question: 'What does a URL identify?', options: ['The location of a resource', 'The speed of a network', 'The owner of a computer', 'The size of a database'], correctAnswer: 'The location of a resource' },
    { question: 'What does frontend code primarily control?', options: ['What users see and interact with', 'The physical web server', 'The internet service provider', 'The source control history'], correctAnswer: 'What users see and interact with' },
    { question: 'What does backend code commonly handle?', options: ['Server logic and data access', 'Monitor color calibration', 'Keyboard shortcuts', 'Browser window size'], correctAnswer: 'Server logic and data access' },
    { question: 'What does DNS help a browser find?', options: ['The server address for a domain name', 'The strongest available password', 'The newest version of HTML', 'The size of a downloaded image'], correctAnswer: 'The server address for a domain name' },
  ],
  general: [
    { question: 'What is an algorithm?', options: ['A step-by-step procedure for solving a problem', 'A type of computer screen', 'A stored password', 'A network cable'], correctAnswer: 'A step-by-step procedure for solving a problem' },
    { question: 'What is a bug in software?', options: ['An error that causes unintended behavior', 'A finished feature', 'A backup copy', 'A user account'], correctAnswer: 'An error that causes unintended behavior' },
    { question: 'What is a variable used for?', options: ['Storing a value that code can use', 'Drawing pixels on a monitor', 'Connecting a device to Wi-Fi', 'Naming a folder only'], correctAnswer: 'Storing a value that code can use' },
    { question: 'Why are functions useful in programming?', options: ['They group reusable behavior', 'They permanently store every output', 'They replace all variables', 'They prevent code from receiving input'], correctAnswer: 'They group reusable behavior' },
    { question: 'What does a loop do?', options: ['Repeats instructions while a condition applies', 'Deletes all source code', 'Creates a new programming language', 'Turns text into hardware'], correctAnswer: 'Repeats instructions while a condition applies' },
    { question: 'What is version control used for?', options: ['Tracking and coordinating code changes', 'Increasing screen resolution', 'Running code without a computer', 'Choosing a stronger Wi-Fi signal'], correctAnswer: 'Tracking and coordinating code changes' },
    { question: 'Which pair contains the two Boolean values?', options: ['true and false', 'yes and no', '1 and 2', 'on and off'], correctAnswer: 'true and false' },
    { question: 'What is debugging?', options: ['Finding and fixing problems in code', 'Publishing an app store listing', 'Designing a company logo', 'Buying a web domain'], correctAnswer: 'Finding and fixing problems in code' },
  ],
  tech: [
    { question: 'What does CPU stand for?', options: ['Central Processing Unit', 'Computer Personal Utility', 'Central Program Upload', 'Core Power User'], correctAnswer: 'Central Processing Unit' },
    { question: 'What is RAM mainly used for?', options: ['Temporary working data for running programs', 'Permanent archival storage', 'Connecting to a wireless network', 'Displaying graphics on paper'], correctAnswer: 'Temporary working data for running programs' },
    { question: 'What is cloud computing?', options: ['Using computing resources delivered over a network', 'Predicting the weather with code', 'Saving files only on a phone', 'Building computers without storage'], correctAnswer: 'Using computing resources delivered over a network' },
    { question: 'What does open-source software make available?', options: ['Its source code under a license', 'Every user password', 'Unlimited hardware', 'Private customer records'], correctAnswer: 'Its source code under a license' },
    { question: 'What is an operating system responsible for?', options: ['Managing hardware and running applications', 'Writing every application automatically', 'Replacing the internet', 'Creating website content'], correctAnswer: 'Managing hardware and running applications' },
    { question: 'What is a file extension such as .jpg commonly used to indicate?', options: ['The file type or format', 'The file owner password', 'The computer model', 'The internet speed'], correctAnswer: 'The file type or format' },
  ],
}

const TOPIC_RULES = [
  { key: 'html', patterns: [/\bhtml\b/, /\bmarkup\b/, /semantic element/] },
  { key: 'css', patterns: [/\bcss\b/, /stylesheet/, /flexbox/, /css grid/, /web styl/] },
  { key: 'javascript', patterns: [/javascript/, /\bjs\b/, /\bdom\b/, /node\.js/, /typescript/] },
  { key: 'python', patterns: [/python/, /\bpandas\b/, /\bdjango\b/, /\bflask\b/] },
  { key: 'aiMl', patterns: [/artificial intelligence/, /machine learning/, /\bai\b/, /\bml\b/, /neural/, /language model/, /prompt/] },
  { key: 'data', patterns: [/\bdata\b/, /analytics?/, /analysis/, /\bsql\b/, /database/, /spreadsheet/, /visuali[sz]/] },
  { key: 'cybersecurity', patterns: [/cyber/, /security/, /network safety/, /phishing/, /encryption/, /vulnerabil/] },
  { key: 'mobile', patterns: [/mobile/, /android/, /\bios\b/, /swift/, /kotlin/, /react native/, /flutter/, /\bapp\b/] },
  { key: 'web', patterns: [/\bweb\b/, /website/, /frontend/, /front-end/, /backend/, /back-end/, /browser/, /\bhttp/, /\bapi\b/] },
  { key: 'general', patterns: [/programming/, /\bcoding\b/, /\bcode\b/, /algorithm/, /software/, /computer science/, /debug/] },
]

const TOPIC_LABELS = {
  general: 'General programming concepts',
  tech: 'Technology fundamentals',
}

function normalizeText(value) {
  return String(value || '').trim().toLowerCase()
}

function getCoveredSteps(recentTasks, macroSteps) {
  const tasks = Array.isArray(recentTasks) ? recentTasks.filter(Boolean) : []
  const steps = Array.isArray(macroSteps) ? macroSteps.filter(Boolean) : []
  if (!tasks.length) return steps

  const taskLabels = tasks.flatMap((task) => [task.name, task.topic].map(normalizeText).filter(Boolean))
  const covered = steps.filter((step) => {
    const stepName = normalizeText(step.name)
    const stepTask = normalizeText(step.task)
    return taskLabels.some((label) => label === stepName || label === stepTask)
  })

  if (covered.length) return covered
  return tasks.map((task) => ({ name: task.topic || task.name, task: task.name }))
}

function detectTopicKeys(step) {
  const content = normalizeText(`${step?.name || ''} ${step?.task || ''}`)
  return TOPIC_RULES.filter(({ patterns }) => patterns.some((pattern) => pattern.test(content))).map(({ key }) => key)
}

function isValidQuestion(question) {
  return Boolean(
    question?.question &&
    question?.topic &&
    Array.isArray(question.options) &&
    question.options.length === 4 &&
    new Set(question.options).size === 4 &&
    question.options.includes(question.correctAnswer)
  )
}

function materializeQuestions(bank, topic) {
  return bank.map((question) => ({
    ...question,
    options: shuffle(question.options),
    topic,
  }))
}

/**
 * recentTasks: recently completed task objects { name, topic }.
 * macroSteps: the authored roadmap steps { name, why, task }.
 * Returns up to `count` objective multiple-choice questions with four options.
 */
export function buildLevelCheckQuiz(recentTasks, macroSteps, count = 10) {
  const requestedCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 10
  if (requestedCount === 0) return []

  const coveredSteps = getCoveredSteps(recentTasks, macroSteps)
  const topicOwners = new Map()

  coveredSteps.forEach((step) => {
    detectTopicKeys(step).forEach((key) => {
      if (!topicOwners.has(key)) topicOwners.set(key, step.name || step.topic || TOPIC_LABELS.general)
    })
  })

  const topicQuestions = Array.from(topicOwners.entries()).flatMap(([key, topic]) =>
    materializeQuestions(QUESTION_BANK[key], topic)
  )
  const selected = shuffle(uniqueBy(topicQuestions, 'question')).slice(0, requestedCount)
  const usedQuestions = new Set(selected.map(({ question }) => question))

  const fillerQuestions = ['general', 'tech'].flatMap((key) =>
    materializeQuestions(QUESTION_BANK[key], TOPIC_LABELS[key])
  )
  const availableFiller = shuffle(fillerQuestions).filter(({ question }) => !usedQuestions.has(question))
  selected.push(...availableFiller.slice(0, requestedCount - selected.length))

  if (selected.length < requestedCount) {
    const remainingBank = Object.entries(QUESTION_BANK).flatMap(([key, bank]) =>
      materializeQuestions(bank, TOPIC_LABELS[key] || 'Technology fundamentals')
    )
    const remaining = shuffle(remainingBank).filter(({ question }) =>
      !selected.some((selectedQuestion) => selectedQuestion.question === question)
    )
    selected.push(...remaining.slice(0, requestedCount - selected.length))
  }

  return shuffle(uniqueBy(selected, 'question')).filter(isValidQuestion).slice(0, requestedCount)
}

/**
 * Scores an answered quiz. Returns per-topic correct/incorrect counts so
 * the caller can update weakness_profile once per distinct topic rather
 * than once per question.
 */
export function scoreQuiz(answeredQuestions) {
  const topicResults = {}
  answeredQuestions.forEach((q) => {
    if (!topicResults[q.topic]) topicResults[q.topic] = { correct: 0, wrong: 0 }
    if (q.wasCorrect) topicResults[q.topic].correct++
    else topicResults[q.topic].wrong++
  })

  const weakTopics = Object.entries(topicResults)
    .filter(([, r]) => r.wrong > r.correct)
    .map(([topic]) => topic)

  const scoreCount = answeredQuestions.filter((q) => q.wasCorrect).length

  return { topicResults, weakTopics, scoreCount, total: answeredQuestions.length }
}

/** Weak_score delta to apply per topic after scoring (net correct vs wrong). */
export function weaknessDeltaForTopic(topicResult) {
  return topicResult.wrong > topicResult.correct ? 1 : -0.5
}

/** Self-reported difficulty ("stuck"/"couldn't start") also nudges weakness. */
export function weaknessDeltaForFeedback(feedback) {
  if (feedback === 'not_started') return 1.5
  if (feedback === 'stuck') return 1
  return -0.3 // 'completed'
}
