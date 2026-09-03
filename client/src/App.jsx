import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicSite from './PublicSite.jsx';
import AdminApp from './admin/AdminApp.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicSite />} />
        <Route path="/admin" element={<AdminApp />} />
      </Routes>
    </BrowserRouter>
  );
}