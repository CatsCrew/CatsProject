export class UnitHelper {
  /**
   * Converts a height in meters to a locale-specific unit and formats it.
   *
   * @param {number} heightInMeters The height in meters.
   * @param {string} locale The locale string (e.g., 'en-US', 'en-GB', 'de-DE').
   * @param {boolean} [includeInches=true] For locales using feet, whether to
   *   display inches (e.g., "5 ft 10 in") or just feet (e.g., "5.83 ft").
   *   Defaults to true.
   * @returns {string} The formatted height string.
   */
  public static formatHeightForLocale(
    heightInMeters: number,
    locale: string,
    includeInches = true
  ) {
    // Rough mapping of locales to preferred height units.
    // This is a simplified example and might need to be expanded for more edge cases.
    const localeUnitMap = {
      // English-speaking countries often use imperial for height
      "en-US": "foot", // US uses feet and inches
      "en-GB": "foot", // UK commonly uses feet and inches for height
      "en-CA": "meter", // Canada is officially metric, but feet/inches are also common
      "en-AU": "meter", // Australia is metric

      // European countries are generally metric
      "de-DE": "meter",
      "fr-FR": "meter",
      "es-ES": "meter",
      "it-IT": "meter",

      // Other countries
      "ja-JP": "meter",
      "zh-CN": "meter",
      "ru-RU": "meter",
      "pt-BR": "meter",
      "ar-SA": "meter", // Most of the Middle East is metric
    };

    // Default to meter if the locale is not explicitly mapped or unknown
    const targetUnit = localeUnitMap[locale] || 'meter';

    // Conversions
    const METERS_TO_FEET = 3.28084; // 1 meter = 3.28084 feet
    const FEET_TO_INCHES = 12;

    if (targetUnit === "foot") {
      const totalFeet = heightInMeters * METERS_TO_FEET;

      if (includeInches) {
        const wholeFeet = Math.floor(totalFeet);
        const remainingInches = Math.round(
          (totalFeet - wholeFeet) * FEET_TO_INCHES
        );

        // Special case for displaying feet and inches.
        // Intl.NumberFormat doesn't directly support "X feet Y inches" as a single unit.
        // So, we format them separately and combine.
        const feetFormatter = new Intl.NumberFormat(locale, {
          style: "unit",
          unit: "foot",
          unitDisplay: "short",
          maximumFractionDigits: 0, // No decimal for feet
        });

        const inchFormatter = new Intl.NumberFormat(locale, {
          style: "unit",
          unit: "inch",
          unitDisplay: "short",
          maximumFractionDigits: 0, // No decimal for inches
        });

        // Handle cases where remainingInches might round up to 12
        if (remainingInches >= 12) {
          return `${feetFormatter.format(wholeFeet + 1)}`;
        }

        return `${feetFormatter.format(wholeFeet)} ${inchFormatter.format(
          remainingInches
        )}`;
      } else {
        // If not including inches, just format as feet with decimals
        const formatter = new Intl.NumberFormat(locale, {
          style: "unit",
          unit: "foot",
          unitDisplay: "long", // 'long' or 'short' depending on preference
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        return formatter.format(totalFeet);
      }
    } else {
      // For meters (or any other direct unit)
      const formatter = new Intl.NumberFormat(locale, {
        style: "unit",
        unit: "meter",
        unitDisplay: "long",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
      return formatter.format(heightInMeters);
    }
  }

  /**
   * Converts a weight in kilograms to a locale-specific unit and formats it.
   *
   * @param {number} weightInKg The weight in kilograms.
   * @param {string} locale The locale string (e.g., 'en-US', 'en-GB', 'de-DE').
   * @param {boolean} [includeStoneAndPounds=false] For locales using pounds, whether to
   *   display stones and pounds (e.g., "10 st 4 lb") or just total pounds (e.g., "144 lb").
   *   Defaults to false. This option is primarily relevant for 'en-GB'.
   * @returns {string} The formatted weight string.
   */
  public static formatWeightForLocale(
    weightInGrams: number,
    locale: string,
    includeStoneAndPounds = false
  ) {
    const weightInKg = weightInGrams / 1000;

    // Rough mapping of locales to preferred weight units.
    // This is a simplified example and might need to be expanded.
    const localeUnitMap = {
      // English-speaking countries
      "en-US": "pound", // US uses pounds
      "en-GB": "pound", // UK uses stones and pounds (culturally), or just pounds, or kg
      "en-CA": "kilogram", // Canada is officially metric
      "en-AU": "kilogram", // Australia is metric

      // European countries are generally metric
      "de-DE": "kilogram",
      "fr-FR": "kilogram",
      "es-ES": "kilogram",
      "it-IT": "kilogram",

      // Other countries
      "ja-JP": "kilogram",
      "zh-CN": "kilogram",
      "ru-RU": "kilogram",
      "pt-BR": "kilogram",
      "ar-SA": "kilogram",
    };

    // Default to kilogram if the locale is not explicitly mapped or unknown
    const targetUnit = localeUnitMap[locale] || "kilogram";

    // Conversions
    const KG_TO_POUNDS = 2.20462; // 1 kg = 2.20462 pounds
    const POUNDS_IN_STONE = 14; // 1 stone = 14 pounds

    if (targetUnit === "pound") {
      const totalPounds = weightInKg * KG_TO_POUNDS;

      // Special handling for UK style (stones and pounds)
      if (includeStoneAndPounds && locale === "en-GB") {
        const wholeStones = Math.floor(totalPounds / POUNDS_IN_STONE);
        const remainingPounds = Math.round(totalPounds % POUNDS_IN_STONE);

        // Again, Intl.NumberFormat doesn't directly support "X st Y lb"
        const stoneFormatter = new Intl.NumberFormat(locale, {
          style: "unit",
          unit: "stone",
          unitDisplay: "short",
          maximumFractionDigits: 0,
        });

        const poundFormatter = new Intl.NumberFormat(locale, {
          style: "unit",
          unit: "pound",
          unitDisplay: "short",
          maximumFractionDigits: 0,
        });

        // Handle edge case where remaining pounds round up to 14
        if (remainingPounds >= POUNDS_IN_STONE) {
          return `${stoneFormatter.format(wholeStones + 1)}`;
        }

        return `${stoneFormatter.format(wholeStones)} ${poundFormatter.format(
          remainingPounds
        )}`;
      } else {
        // Just format as pounds with decimals
        const formatter = new Intl.NumberFormat(locale, {
          style: "unit",
          unit: "pound",
          unitDisplay: "long",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0, // Usually 0 or 1 decimal for pounds
        });
        return formatter.format(totalPounds);
      }
    } else {
      // For kilograms (or any other direct unit)
      const formatter = new Intl.NumberFormat(locale, {
        style: "unit",
        unit: "kilogram",
        unitDisplay: "long",
        minimumFractionDigits: 0,
        maximumFractionDigits: 1, // Usually 0 or 1 decimal for kg
      });
      return formatter.format(weightInKg);
    }
  }
}
