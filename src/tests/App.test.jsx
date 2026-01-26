import React from 'react'
import { render, screen } from '@testing-library/react'
import App from '../App'
import { Provider } from 'react-redux'
import store from '../store/store'
import { BrowserRouter } from 'react-router-dom'

test('renders header title', ()=>{
  render(<Provider store={store}><BrowserRouter><App/></BrowserRouter></Provider>)
  expect(screen.getByText(/WebMark/i)).toBeInTheDocument()
})
