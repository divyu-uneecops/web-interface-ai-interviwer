export function buildPenaltyPayload(
  interviewId: string,
  eventType: string,
  timeStamp: number,
  screenshotValue: string | null,
  mappingValues: Record<string, any>
) {
  const values: Array<{
    propertyId: string;
    key: string;
    value: string | number | any[];
  }> = [
    {
      propertyId: mappingValues?.interviewId?.id || "",
      key: "interviewId",
      value: interviewId,
    },
    {
      propertyId: mappingValues?.eventType?.id,
      key: "eventType",
      value: eventType,
    },
    {
      propertyId: mappingValues?.timeStamp?.id,
      key: "timeStamp",
      value: timeStamp,
    },
  ];
  if (screenshotValue) {
    values.push({
      propertyId: mappingValues?.screenshot?.id,
      key: "screenshot",
      value: [screenshotValue],
    });
  }
  const propertyIds = [
    mappingValues?.interviewId?.id,
    mappingValues?.eventType?.id,
    mappingValues?.timeStamp?.id,
    mappingValues?.screenshot?.id,
  ];

  return {
    values,
    propertyIds,
  };
}
