/**
 * Three chained loops, drawn in tones of the page's own ink color so they
 * follow the page palette and the dark toggle. Each loop is cut into three
 * segments: discovery (the first part of every loop), work, and launch. The
 * two outer loops are faded to suggest the loop repeating before and after.
 *
 * `bg` is the page background, which the lighter tones blend toward.
 */
export function LoopsGraphic({
  className,
  bg,
}: {
  className?: string;
  bg: string;
}) {
  const mix = (ink: number) =>
    `color-mix(in srgb, currentColor ${ink}%, ${bg})`;
  const tone = {
    discovery: mix(38),
    work: mix(100),
    cross: mix(72),
    launch: mix(62),
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 1542 378"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.2">
        <path
          d="M1527 362.696C1501.6 362.696 1477.93 361.732 1455.85 359.931C1376.82 353.484 1318.31 336.307 1275 314.193M1275 314.193C1145.76 248.206 1151.84 138.261 1151.84 138.261C1151.84 70.1858 1207.02 15 1275.1 15C1342.98 15 1398.16 70.1858 1398.16 138.261C1398.16 138.261 1403.06 226.962 1310.41 292.838C1299.91 300.303 1288.16 307.476 1275 314.193ZM1275 314.193C1262.1 320.781 1247.85 326.931 1232.1 332.49C1180.25 350.802 1112.22 362.696 1023 362.696"
          strokeWidth="30"
          strokeLinecap="round"
          style={{ stroke: tone.launch }}
        />
        <path
          d="M1161 351.181C1121.82 358.471 1076.17 362.696 1023 362.696"
          strokeWidth="30"
          strokeLinecap="round"
          style={{ stroke: tone.discovery }}
        />
        <path
          d="M1232.1 332.49C1211.37 339.812 1188.04 346.109 1161.81 351.029C1122.45 358.412 1076.54 362.696 1023 362.696"
          strokeWidth="30"
          style={{ stroke: tone.discovery }}
        />
        <path
          d="M1527 362.696C1501.6 362.696 1477.93 361.732 1455.85 359.931C1440.15 358.65 1425.26 356.946 1411.13 354.863"
          strokeWidth="30"
          strokeLinecap="round"
          style={{ stroke: tone.launch }}
        />
        <path
          d="M1455.85 359.931C1141.01 334.247 1151.84 138.261 1151.84 138.261C1151.84 70.1858 1207.02 15 1275.1 15C1342.98 15 1398.16 70.1858 1398.16 138.261C1398.16 138.261 1403.06 226.962 1310.41 292.838"
          strokeWidth="30"
          style={{ stroke: tone.work }}
        />
        <path
          d="M1310.41 292.838C1289.61 307.626 1263.89 321.264 1232.1 332.49"
          strokeWidth="30"
          style={{ stroke: tone.cross }}
        />
      </g>
      <g opacity="0.2">
        <path
          d="M519 362.696C493.605 362.696 469.926 361.732 447.85 359.931C368.821 353.484 310.312 336.307 267 314.193M267 314.193C137.762 248.206 143.839 138.261 143.839 138.261C143.839 70.1858 199.025 15 267.1 15C334.975 15 390.161 70.1858 390.161 138.261C390.161 138.261 395.064 226.962 302.41 292.838C291.909 300.303 280.156 307.476 267 314.193ZM267 314.193C254.097 320.781 239.845 326.931 224.104 332.49C172.245 350.802 104.221 362.696 15 362.696"
          strokeWidth="30"
          strokeLinecap="round"
          style={{ stroke: tone.launch }}
        />
        <path
          d="M153 351.181C113.819 358.471 68.1738 362.696 15 362.696"
          strokeWidth="30"
          strokeLinecap="round"
          style={{ stroke: tone.discovery }}
        />
        <path
          d="M224.104 332.49C203.366 339.812 180.043 346.109 153.813 351.029C114.451 358.412 68.5423 362.696 15 362.696"
          strokeWidth="30"
          style={{ stroke: tone.discovery }}
        />
        <path
          d="M519 362.696C493.605 362.696 469.926 361.732 447.85 359.931C432.148 358.65 417.257 356.946 403.133 354.863"
          strokeWidth="30"
          strokeLinecap="round"
          style={{ stroke: tone.launch }}
        />
        <path
          d="M447.85 359.931C133.007 334.247 143.839 138.261 143.839 138.261C143.839 70.1858 199.025 15 267.1 15C334.975 15 390.161 70.1858 390.161 138.261C390.161 138.261 395.064 226.962 302.41 292.838"
          strokeWidth="30"
          style={{ stroke: tone.work }}
        />
        <path
          d="M302.41 292.838C281.61 307.626 255.895 321.264 224.104 332.49"
          strokeWidth="30"
          style={{ stroke: tone.cross }}
        />
      </g>
      <path
        d="M1023 362.696C997.605 362.696 973.926 361.732 951.85 359.931C872.821 353.484 814.312 336.307 771 314.193M771 314.193C641.762 248.206 647.839 138.261 647.839 138.261C647.839 70.1858 703.025 15 771.1 15C838.975 15 894.161 70.1858 894.161 138.261C894.161 138.261 899.064 226.962 806.41 292.838C795.909 300.303 784.156 307.476 771 314.193ZM771 314.193C758.097 320.781 743.845 326.931 728.104 332.49C676.245 350.802 608.221 362.696 519 362.696"
        strokeWidth="30"
        strokeLinecap="round"
        style={{ stroke: tone.launch }}
      />
      <path
        d="M657 351.181C617.819 358.471 572.174 362.696 519 362.696"
        strokeWidth="30"
        strokeLinecap="round"
        style={{ stroke: tone.discovery }}
      />
      <path
        d="M728.104 332.49C707.366 339.812 684.043 346.109 657.813 351.029C618.451 358.412 572.542 362.696 519 362.696"
        strokeWidth="30"
        style={{ stroke: tone.discovery }}
      />
      <path
        d="M1023 362.696C997.605 362.696 973.926 361.732 951.85 359.931C936.148 358.65 921.257 356.946 907.133 354.863"
        strokeWidth="30"
        strokeLinecap="round"
        style={{ stroke: tone.launch }}
      />
      <path
        d="M951.85 359.931C637.007 334.247 647.839 138.261 647.839 138.261C647.839 70.1858 703.025 15 771.1 15C838.975 15 894.161 70.1858 894.161 138.261C894.161 138.261 899.064 226.962 806.41 292.838"
        strokeWidth="30"
        style={{ stroke: tone.work }}
      />
      <path
        d="M806.41 292.838C785.61 307.626 759.895 321.264 728.104 332.49"
        strokeWidth="30"
        style={{ stroke: tone.cross }}
      />
      <g
        fill="currentColor"
        fontSize="30"
        fontWeight="700"
        style={{ fontFamily: "var(--font-hand), cursive" }}
      >
        <text x="585" y="318" textAnchor="middle">
          Discovery
        </text>
        <text x="900" y="54" textAnchor="start">
          Work
        </text>
        <text x="985" y="318" textAnchor="middle">
          Launch
        </text>
      </g>
    </svg>
  );
}
