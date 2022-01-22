import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PostList from './Components/PostList';
import Post from './Components/Post';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<PostList />} />
        <Route path='/PostDetail' element={<Post />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
