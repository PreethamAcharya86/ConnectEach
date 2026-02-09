import React from 'react'
import styles from './styles.module.css'

export default function Footer() {
  return (
    <div className={`${styles.footer} bg-gray-400 w-full flex flex-col items-center justify-end text-sm text-white`}>
        <div className="flex gap-4 p-2">
          <a href="mailto:preethamacharya16@gmail.com" className="hover:text-blue-500">
            Email
          </a>
          <a href="https://github.com/PreethamAcharya86" target="_blank" className="hover:text-blue-500">
            GitHub
          </a>
          <a href="https://linkedin.com/in/preetham-acharya" target="_blank" className="hover:text-blue-500">
            LinkedIn
          </a>
        </div>
    </div>
  )
}
