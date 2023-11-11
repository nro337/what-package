import { useQuery } from "@tanstack/react-query";
import "./App.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { LineWave } from "react-loader-spinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { PackageManagerSelect} from "./components/package-select";
import { PackageDetails } from "./types/packages";

function App() {
  const [search, setSearch] = useState<string>("");
  const [package_manager, setPackageManager] = useState<string>("");

  // const {
  //   data,
  //   refetch: SearchPackage,
  //   isLoading,
  // } = useQuery({
  //   queryKey: ["package"],
  //   queryFn: () =>
  //     fetch(
  //       `https://libraries.io/api/NPM/${search.toLowerCase()}?api_key=${
  //         import.meta.env.VITE_LIBRARIES_IO_API_KEY
  //       }`
  //     ).then((res) => res.json()),
  //   enabled: false,
  // });

  const {
    data: package_manager_data,
    // isLoading
  } = useQuery({
    queryKey: ["packages"],
    queryFn: () =>
      fetch(
        `https://libraries.io/api/platforms?api_key=${import.meta.env.VITE_LIBRARIES_IO_API_KEY}`
      ).then((res) => res.json()),
  });

  // https://libraries.io/api/search?q=grunt&platforms=npm&api_key=423c27d20bd8635bdd02075ebf1c1f9e
  const {
    data: package_search_data,
    isLoading: package_search_isLoading,
    refetch: SearchPackage,
  } = useQuery({
    queryKey: ["package_search"],
    queryFn: () =>
      fetch(
        `https://libraries.io/api/search?q=${search.toLowerCase()}&platforms=${package_manager.toLowerCase()}&api_key=${import.meta.env.VITE_LIBRARIES_IO_API_KEY}`
      ).then((res) => res.json()),
      enabled: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const searchforpackage = () => {
    SearchPackage();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>What Package</CardTitle>
          <CardDescription>Search for a package from any package manager</CardDescription>
        </CardHeader>
        <div className="flex flex-row w-full justify-center space-x-2 p-4">
          <Input type="text" placeholder="Search" onChange={handleChange} className="w-1/2" />
          <PackageManagerSelect packages={package_manager_data} setPackageManager={setPackageManager} />
          <Button type="submit" onClick={searchforpackage} disabled={!search || !package_manager}>
            Search
          </Button>
        </div>
        <CardContent className="grid gap-4">
        {package_search_isLoading && (
          <div className="flex flex-row place-content-center">
            <LineWave
              height={100}
              width={100}
              ariaLabel="Loading..."
              firstLineColor="#f1f5f9"
              middleLineColor="#0284c7"
              lastLineColor="#374151"
            />
          </div>
        )}
        {package_search_data && package_search_data?.map((item: PackageDetails) => (
          <Card key={item.name}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Latest Version: {item.latest_stable_release_number}</p>
              <p>Stars: {item.stars}</p>
              <p>Rank: {item.rank}</p>
            </CardContent>
          </Card>
        ))}
        </CardContent>
      </Card>
    </>
  );
}

export default App;
