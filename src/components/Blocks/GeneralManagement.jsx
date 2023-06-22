import { Link, Route, Routes } from "react-router-dom";

export default function GeneralManagement() {
  return (
    <div>
      <Link to='./users' className="test">Click Me</Link>
      <br />
      <Routes>
        <Route path="/*" element={<>SHuta</>} />
        <Route path="/users" element={<>Users</>} />
      </Routes>
    </div>
  );
}
