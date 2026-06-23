"use client";

import dynamic from "next/dynamic";

const TicketMap = dynamic(() => import("./TicketMapClient"), {
  ssr: false,
});

export default TicketMap;
