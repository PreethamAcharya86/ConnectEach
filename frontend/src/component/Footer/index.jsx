import React from 'react'
import styles from './styles.module.css'

export default function Footer() {
  return (
    <div className={`${styles.footer} bg-gray-400 w-full flex flex-col items-center justify-end text-sm text-white`}>
        <div>
            Email: preethamacharya16@gmail.com
        </div>
        <div>
            Contact us : 8618373078
        </div>
      
    </div>
  )
}
