import { SelectCountryAndRegion } from "../particles/SelectCountryAndRegion";

export interface TeamHolidaysMenuProps {
  selectedCountryIsoCode: string | undefined;
  selectedRegionIsoCode: string | undefined;
  onChangeCountry: (country: string) => void;
  onChangeRegion: (region: string) => void;
}

export const TeamHolidaysMenu = ({
  selectedCountryIsoCode,
  selectedRegionIsoCode,
  onChangeCountry,
  onChangeRegion,
}: TeamHolidaysMenuProps) => {
  return (
    <div>
      <SelectCountryAndRegion
        selectedCountryIsoCode={selectedCountryIsoCode}
        selectedRegionIsoCode={selectedRegionIsoCode}
        onChangeCountry={onChangeCountry}
        onChangeRegion={onChangeRegion}
      />
    </div>
  );
};
