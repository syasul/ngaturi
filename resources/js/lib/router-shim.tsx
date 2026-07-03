import React from 'react'
import { Link as InertiaLink, router } from '@inertiajs/react'

// Link component shim
export const Link = ({ to, children, ...props }: any) => {
  return (
    <InertiaLink href={to} {...props}>
      {children}
    </InertiaLink>
  )
}

// useNavigate hook shim
export const useNavigate = () => {
  return (to: any, options?: any) => {
    if (typeof to === 'number') {
      window.history.go(to)
    } else {
      router.visit(to, options)
    }
  }
}

// useLocation hook shim
export const useLocation = () => {
  return {
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
  }
}

// useParams hook shim
export const useParams = () => {
  const path = window.location.pathname
  const params: any = {}
  
  if (path.startsWith('/u/')) {
    const parts = path.split('/')
    params.slug = parts[2]
  } else if (path.startsWith('/theme-preview/')) {
    const parts = path.split('/')
    params.themeId = parts[2]
  } else if (path.includes('/checkout/')) {
    const parts = path.split('/')
    params.orderId = parts[parts.length - 1]
  } else {
    // General fallback: last part of URL
    const parts = path.split('/')
    const last = parts[parts.length - 1]
    if (last && last !== 'dashboard' && last !== 'admin') {
      params.slug = last
      params.themeId = last
      params.orderId = last
    }
  }
  return params
}

// useSearchParams hook shim
export const useSearchParams = () => {
  const searchParams = new URLSearchParams(window.location.search)
  const setSearchParams = (newParams: any) => {
    const url = new URL(window.location.href)
    if (typeof newParams === 'function') {
      // support functional updates if any
      const updated = newParams(searchParams)
      updated.forEach((val: string, key: string) => url.searchParams.set(key, val))
    } else {
      Object.keys(newParams).forEach(k => url.searchParams.set(k, newParams[k]))
    }
    router.visit(url.pathname + url.search)
  }
  return [searchParams, setSearchParams] as const
}
