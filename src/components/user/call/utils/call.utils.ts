const PENALTY_PROPERTY_IDS = {
  interviewId: "698c17cd2d28552b6f555919",
  eventType: "698c1813ac16de7384384f10",
  timeStamp: "698c185e2d28552b6f55591a",
  screenshot: "698ec056dfb659edb0bec787",
};
const PENALTY_PROPERTY_IDS_BASE_LIST = [
  PENALTY_PROPERTY_IDS.interviewId,
  PENALTY_PROPERTY_IDS.eventType,
  PENALTY_PROPERTY_IDS.timeStamp,
];

export function buildPenaltyPayload(
  interviewId: string,
  eventType: string,
  timeStamp: number,
  screenshotValue: string | null
) {
  const values: Array<{
    propertyId: string;
    key: string;
    value: string | number | any[];
  }> = [
    {
      propertyId: PENALTY_PROPERTY_IDS.interviewId,
      key: "interviewId",
      value: interviewId,
    },
    {
      propertyId: PENALTY_PROPERTY_IDS.eventType,
      key: "eventType",
      value: eventType,
    },
    {
      propertyId: PENALTY_PROPERTY_IDS.timeStamp,
      key: "timeStamp",
      value: timeStamp,
    },
  ];
  if (screenshotValue) {
    values.push({
      propertyId: PENALTY_PROPERTY_IDS.screenshot,
      key: "screenshot",
      value: [screenshotValue],
    });
  }
  const propertyIds = screenshotValue
    ? [...PENALTY_PROPERTY_IDS_BASE_LIST, PENALTY_PROPERTY_IDS.screenshot]
    : PENALTY_PROPERTY_IDS_BASE_LIST;
  return {
    values,
    propertyIds,
  };
}
