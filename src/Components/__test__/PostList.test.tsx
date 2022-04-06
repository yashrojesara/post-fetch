import React from 'react'
import { act, render, screen, waitFor } from '@testing-library/react'
import PostList from '../PostList'
import * as PostFetchServices from '../service'
const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

beforeEach(() => {
    // IntersectionObserver isn't available in test environment
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

test('Should Render Correctly', () => {
    render(<PostList />)
})

// test('Get posts api should be called once only on component render', async () => {
//     const mockApiFunction = jest.spyOn(PostFetchServices, 'getPosts')
//     await act(async () => {
//       render(<PostList />)
//       await waitFor(async () => {
//         expect(mockApiFunction).toHaveBeenCalledTimes(1)
//       })
//     })
//   })

test('Table should be present in the document', () => {
    render(<PostList />)
    const element = screen.getByTestId(/table/i)
    expect(element).toBeInTheDocument();
})

test('Author should be present in the table', () => {
    render(<PostList />)
    const element = screen.getByTestId(/author/i)
    expect(element).toBeInTheDocument();
})

test('Created AT should be present in the table', () => {
    render(<PostList />)
    const element = screen.getByTestId(/created/i)
    expect(element).toBeInTheDocument();
})

test('URL should be present in the table', () => {
    render(<PostList />)
    const element = screen.getByTestId(/url/i)
    expect(element).toBeInTheDocument();
})

test('Title should be present in the table', () => {
    render(<PostList />)
    const element = screen.getByTestId(/title/i)
    expect(element).toBeInTheDocument();
}) 
