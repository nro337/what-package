import { useQueries, useQuery } from "@tanstack/react-query";
import "./App.css";
// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { LineWave } from "react-loader-spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PackageManagerSelect } from "./components/package-select";
import { CombinedPackageDetails, PackageDetails } from "./types/packages";
import { Skeleton } from "@/components/ui/skeleton";
import Sidebar from "./SidebarCard";

function App() {
  const [search, setSearch] = useState<string>("");
  const [package_manager, setPackageManager] = useState<string>("");
  const [cardSelected, setCardSelected] = useState<boolean>(false);
  // const [libraries_io_package_results, setLibrariesIOPackageResults] = useState<PackageDetails[]>([]);
  // const [combinedGHResults, setCombinedGHResults] = useState<CombinedPackageDetails[]>([]);

  const {
    data: package_manager_data,
    // isLoading
  } = useQuery({
    queryKey: ["packages"],
    queryFn: () =>
      fetch(
        `https://libraries.io/api/platforms?api_key=${
          import.meta.env.VITE_LIBRARIES_IO_API_KEY
        }`
      ).then((res) => res.json()),
  });

  const {
    data: package_search_data,
    isLoading: package_search_isLoading,
    // refetch: SearchPackage,
  } = useQuery({
    queryKey: ["package_search", search, package_manager],
    queryFn: () =>
      fetch(
        `https://libraries.io/api/search?q=${search.toLowerCase()}&platforms=${package_manager.toLowerCase()}&api_key=${
          import.meta.env.VITE_LIBRARIES_IO_API_KEY
        }`
      ).then((res) => res.json()),
    enabled: !!search && !!package_manager,
  });

  const combinedPackageQueries = useQueries({
    queries: package_search_data
      ? package_search_data.map((item: PackageDetails) => ({
          queryKey: [
            "gh_package_search",
            item.repository_url?.split("/").at(-2),
            item.repository_url?.split("/").at(-1),
          ],
          queryFn: () =>
            fetch(
              `https://api.github.com/repos/${item.repository_url
                ?.split("/")
                .at(-2)}/${item.repository_url?.split("/").at(-1)}`
            ).then((res) => res.json()),
          enabled:
            !!item.repository_url?.split("/").at(-2) &&
            !!item.repository_url?.split("/").at(-1),
          staletime: Infinity,
        }))
      : [],
    combine: (results) => {
      return {
        data: results.map((item) => ({
          gh_package_data: item,
        })),
        pending: results.some((result) => result.isLoading),
      };
    },
  });

  // const {
  //   data: gh_package_data,
  //   // isLoading: gh_package_isLoading,
  //   refetch: SearchGHPackage,
  // } = useQuery({
  //   queryKey: ["gh_package_search"],
  //   queryFn: () =>
  //     fetch(
  //       `https://api.github.com/repos/${param1}/${param2}`
  //     ).then((res) => res.json()),
  //     enabled: false,
  // });

  // const {
  //   data: gh_package_data,
  //   isLoading: gh_package_isLoading,
  //   refetch: SearchGHPackage,
  // } = useQuery({
  //   queryKey: ["gh_package_search"],
  //   queryFn: () =>
  //     fetch(
  //       `https://api.github.com/repos/TypeStrong/ts-node`
  //     ).then((res) => res.json()),
  //     enabled: false,
  // });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // const searchforpackage = () => {
  //   SearchPackage();
  // };

  // useEffect(() => {
  //   if (package_search_data) {
  //     setLibrariesIOPackageResults(package_search_data);
  //     // package_search_data.forEach((item: PackageDetails) => {
  //     //   const param1 = item.repository_url?.split('/').at(-2);
  //     //   const param2 = item.repository_url?.split('/').at(-1);
  //     //   if (param1 && param2) {
  //     //     GetGHData({param1, param2});
  //     //   }
  //     // })
  //     // console.log(package_search_data);
  //   }
  // }, [package_search_data]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>What Package</CardTitle>
          <CardDescription>
            Search for a package from any package manager
          </CardDescription>
        </CardHeader>
        <div className="flex flex-row w-full justify-center space-x-2 p-4">
          <Input
            type="text"
            placeholder="Search"
            onChange={handleChange}
            className="w-1/2"
          />
          <PackageManagerSelect
            packages={package_manager_data}
            setPackageManager={setPackageManager}
          />
          {/* <Button type="submit" onClick={searchforpackage} disabled={!search || !package_manager}>
            Search
          </Button> */}
        </div>
        <div className={cardSelected ? `grid grid-cols-2` : ``}>
          <CardContent className="grid gap-4" onClick={() => setCardSelected(true)}>
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
            {package_search_data &&
              package_search_data?.map((item: PackageDetails) => (
                <Card key={item.name}>
                  <div className="flex flex-row justify-center content-center pt-4">
                    {combinedPackageQueries.pending ? (
                      <Skeleton className="h-[100px] w-[100px] rounded-full" />
                    ) : (
                      <img
                        src={
                          (
                            combinedPackageQueries?.data.find(
                              (e) =>
                                (
                                  e.gh_package_data
                                    .data as CombinedPackageDetails
                                ).name ===
                                item.repository_url?.split("/").at(-1)
                            )?.gh_package_data.data as CombinedPackageDetails
                          )?.owner.avatar_url
                        }
                        height={100}
                        width={100}
                        className="rounded-full"
                      />
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle>{item.name}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Latest Version: {item.latest_stable_release_number}</p>
                    <p>Stars: {item.stars}</p>
                    <p>Rank: {item.rank}</p>
                    <p>URL: {item.repository_url}</p>
                    <p>
                      {item.repository_url?.split("/").at(-2)}{" "}
                      {item.repository_url?.split("/").at(-1)}
                    </p>
                    <p>
                      {!combinedPackageQueries.pending &&
                        (
                          combinedPackageQueries?.data.find(
                            (e) =>
                              (e.gh_package_data.data as PackageDetails)
                                ?.name ===
                              item.repository_url?.split("/").at(-1)
                          )?.gh_package_data.data as PackageDetails
                        )?.forks}
                    </p>
                  </CardContent>
                </Card>
              ))}
          </CardContent>
          {
            package_search_data && cardSelected && (
              <CardContent className="grid gap-4">
                <Sidebar />
              </CardContent>
            )
          }
        </div>
      </Card>
    </>
  );
}

export default App;
