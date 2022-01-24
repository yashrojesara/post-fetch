import React from 'react'
import { render, screen } from '@testing-library/react'
import Post from '../Post';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
      push: jest.fn()
    })
  }));

test('Should Render Correctly', () => {
    render(<Post />)
})

test('Post should be present in the document', () => {
    render(<Post />)
    const element = screen.getByTestId(/post/i)
    expect(element).toBeInTheDocument()
})