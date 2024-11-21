import React from 'react'
import Layout from '../components/layout/Layout'
import Sudoku from '../components/Mint/Sudoku'
import Button from '../components/reuse-component/Button'

function Mint() {
  return (
    <Layout className={' flex justify-center items-center gap-5 flex-col' }>
        <Sudoku />
        <Button btnText={'Mint'} bg={'bg-blue-500'} textColor={'text-white'} className={'text-2xl px-14 py-3' }/>
    </Layout>
  )
}

export default Mint