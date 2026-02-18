
type ParseParamsIdResult = Success | Failure;

type Success = {
  ok: true,
  id: number,
};

type Failure = {
  ok: false,
  response: Response,
};

export function parseIdParam(id: string): ParseParamsIdResult {

  const failure: Failure = {
    ok: false,
    response: Response.json({
      error: "Bad Request"} , {
      status: 400
    })
  }

  if (!/^\d+$/.test(id)) {
    return failure;
  }

  const idNumber = Number(id);

  if (idNumber <= 0) {
    return failure;
  }

  return {ok: true, id: idNumber};
}