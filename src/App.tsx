import { Routes, Route } from 'react-router-dom'
import { AppShell } from './layouts/AppShell'
import { HomePage } from './pages/HomePage'
import { SubjectPage } from './pages/SubjectPage'
import { LessonPage } from './pages/LessonPage'
import { QuizPage } from './pages/QuizPage'
import { PathsPage } from './pages/PathsPage'
import { ProgressPage } from './pages/ProgressPage'

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/:subjectId" element={<SubjectPage />} />
        <Route path="/:subjectId/:nodeId/:sectionId/:lessonId" element={<LessonPage />} />
        <Route path="/:subjectId/:nodeId/:sectionId/quiz" element={<QuizPage />} />
        <Route path="/paths" element={<PathsPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/review" element={<div style={{ padding: 40, fontFamily: 'Figtree, system-ui, sans-serif' }}><h1>Review</h1><p style={{ color: '#6B6B76' }}>Spaced repetition coming in Phase 2.</p></div>} />
      </Route>
    </Routes>
  )
}

export default App
