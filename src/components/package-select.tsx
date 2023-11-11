import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  // SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PackageManagerDetails } from "@/types/package_managers";

export function PackageManagerSelect({packages, setPackageManager}: {packages: PackageManagerDetails[], setPackageManager: (package_manager: string) => void}) {

  return (
    <Select disabled={!packages} onValueChange={(val) => setPackageManager(val)}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder={packages ? "Select PM" : "Loading..."} />
      </SelectTrigger>
      <SelectContent className="overflow-y-auto max-h-[20rem]">
        <SelectGroup>
          {
            packages?.map((item: PackageManagerDetails) => (
              <SelectItem key={item.name} value={item.name}>
                {item.name}
              </SelectItem>
            ))
          }
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
