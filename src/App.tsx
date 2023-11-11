
import { useQuery } from '@tanstack/react-query'
import './App.css'
import { Button } from '@/components/ui/button'
import { ModeToggle } from './components/mode-toggle'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

function App() {
  const [search, setSearch] = useState<string>('')
  
  const { data, refetch:SearchPackage } = useQuery({
    queryKey: ['package'],
    queryFn: () =>
      fetch(`https://libraries.io/api/NPM/${search.toLowerCase()}?api_key=${import.meta.env.VITE_LIBRARIES_IO_API_KEY}`).then(
        (res) => res.json(),
      ),
    enabled: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const searchforpackage = () => {
    SearchPackage()
  }

  // useEffect(() => {
  //   if (search) {
  //     SearchPackage()
  //   }
  // }, [SearchPackage, search])

  // if (isPending) {
  //   return <div>Loading...</div>
  // }

  return (
    <>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input type="text" placeholder="Search" onChange={handleChange} />
        <Button type="submit" onClick={searchforpackage}>Search</Button>
      </div>
      <div>{data?.description}</div>
      <Button>Click me</Button>
      <ul>
        <li>
          <a href={`/contacts/1`}>Your Name</a>
        </li>
        <li>
          <a href={`/contacts/2`}>Your Friend</a>
        </li>
      </ul>
      <ModeToggle />
    </>
  );
}

export default App
