import {
  Activity,
  Anvil,
  Apple,
  Banana,
  BatteryCharging,
  Bean,
  Building2,
  Castle,
  Cherry,
  Cigarette,
  CircleDot,
  Citrus,
  Cloud,
  CloudRain,
  Coffee,
  Drill,
  Droplet,
  Factory,
  Fish,
  Flame,
  Flower2,
  Fuel,
  Gauge,
  Gem,
  Grape,
  House,
  Landmark,
  LandPlot,
  Layers,
  Leaf,
  MapPin,
  Mountain,
  Nut,
  Palmtree,
  Pickaxe,
  Shell,
  Ship,
  Signpost,
  Snowflake,
  Spline,
  Sprout,
  Star,
  Sun,
  TentTree,
  Tractor,
  TreePine,
  Umbrella,
  Waves,
  Wheat,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";

type CatalogIconProps = {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
};

const ICONS: Record<string, LucideIcon> = {
  activity: Activity,
  anvil: Anvil,
  apple: Apple,
  banana: Banana,
  battery: BatteryCharging,
  bean: Bean,
  building: Building2,
  castle: Castle,
  cherry: Cherry,
  cigarette: Cigarette,
  circle: CircleDot,
  citrus: Citrus,
  cloud: Cloud,
  rain: CloudRain,
  coffee: Coffee,
  drill: Drill,
  droplet: Droplet,
  factory: Factory,
  fish: Fish,
  flame: Flame,
  flower: Flower2,
  fuel: Fuel,
  gauge: Gauge,
  gem: Gem,
  grape: Grape,
  house: House,
  landmark: Landmark,
  land: LandPlot,
  layers: Layers,
  leaf: Leaf,
  pin: MapPin,
  mountain: Mountain,
  nut: Nut,
  palm: Palmtree,
  pickaxe: Pickaxe,
  shell: Shell,
  ship: Ship,
  signpost: Signpost,
  snow: Snowflake,
  spline: Spline,
  sprout: Sprout,
  star: Star,
  sun: Sun,
  tent: TentTree,
  tractor: Tractor,
  tree: TreePine,
  umbrella: Umbrella,
  waves: Waves,
  wheat: Wheat,
  wind: Wind,
  zap: Zap,
};

export function CatalogIcon({
  name,
  size = 16,
  color = "currentColor",
  strokeWidth = 2,
  className,
}: CatalogIconProps) {
  if (name === "volcano") {
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 20 9.2 9.5h5.6L20 20Z" />
        <path d="m9.2 9.5 2.8 2 2.8-2" />
        <path d="M10 6c-1.5-1.2-.7-3.2 1-3.6" />
        <path d="M14 6c1.7-1.4.9-3.4-.6-4" />
      </svg>
    );
  }

  if (name === "corn") {
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3c4 0 5 4 5 8s-2 8-5 8-5-4-5-8 1-8 5-8Z" />
        <path d="M9 6h6M8 10h8M8 14h8M12 3v16" />
        <path d="M7 11c-3 2-3 6-1 9M17 11c3 2 3 6 1 9" />
      </svg>
    );
  }

  if (name === "cotton") {
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="8" cy="10" r="4" />
        <circle cx="16" cy="10" r="4" />
        <circle cx="12" cy="7" r="4" />
        <path d="M7 14c1 4 3 6 5 7 2-1 4-3 5-7M12 12v9" />
      </svg>
    );
  }

  if (name === "potato") {
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6.2 5.8C8.1 3.7 12 3 15 4.1c3.4 1.2 5.3 4.4 4.6 8.1-.7 4-3.7 7.1-7.8 7.6-3.8.5-7.2-1.4-8-4.8-.8-3.1.3-6.9 2.4-9.2Z" />
        <circle cx="9" cy="8" r=".7" fill={color} stroke="none" />
        <circle cx="14.8" cy="7.5" r=".7" fill={color} stroke="none" />
        <circle cx="7.8" cy="13.2" r=".7" fill={color} stroke="none" />
        <circle cx="14.2" cy="15" r=".7" fill={color} stroke="none" />
      </svg>
    );
  }

  if (name === "tomato") {
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 10.2c-1.1 1.1-1.6 2.5-1.3 4.1.6 3.7 4 6.1 8.3 6.1s7.7-2.4 8.3-6.1c.3-1.7-.2-3.1-1.3-4.1" />
        <path d="M8.1 8.9C5.9 8.3 5 6.7 5 6.7c2-.5 3.8-.2 5.1.7C10.4 5 12 3.5 12 3.5s1.6 1.5 1.9 3.9c1.3-.9 3.1-1.2 5.1-.7 0 0-.9 1.6-3.1 2.2" />
        <path d="M12 5.1v5.2M9.5 9.4 12 10.3l2.5-.9" />
      </svg>
    );
  }

  const Icon = ICONS[name] ?? Star;
  return (
    <Icon
      className={className}
      width={size}
      height={size}
      color={color}
      strokeWidth={strokeWidth}
      aria-hidden="true"
    />
  );
}
