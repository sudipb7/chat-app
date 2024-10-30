import { NextRequest, NextResponse } from "next/server";

import { Session } from "@/types";
import { getSearchParams } from "@/lib/utils";
import { getSessionFromReq } from "@/server/utils";

export type WithSessionHandler = ({
  searchParams,
  params,
  session,
  req,
}: {
  req: NextRequest;
  params: Record<string, string>;
  searchParams: Record<string, string>;
  session: Session;
}) => Promise<NextResponse>;

export type WithSessionMetadata = {
  route: string;
  method: string;
};

// Will be used as a middleware to check if the user is authenticated in api routes
export function withSession(handler: WithSessionHandler, metadata: WithSessionMetadata) {
  return async function (req: NextRequest, { params }: { params: Record<string, string> }) {
    const searchParams = getSearchParams(req.url);

    try {
      const session = await getSessionFromReq(req);
      if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

      return await handler({ req, params, searchParams, session });
    } catch (error) {
      console.error(`[ERROR] >> ${metadata.method.toUpperCase()}: ${metadata.route}\n`, error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  };
}
