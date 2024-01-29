const getDateAllTime = (region: string) => {
  return new Date().toLocaleString('id-ID', {
    hour12: false,
    hourCycle: 'h11',
    day: '2-digit',
    month: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour: '2-digit',
    timeZone: region,
  });
};

export const getDateByRegion = (region: string) => {
  const date = new Date(getDateAllTime(region));

  return date.getDate();
};

export const getTimeByRegion = (region: string) => {
  const date = new Date(getDateAllTime(region));

  return date.getTime();
};

export const getAllDateByRegion = (region: string) => {
  const date = new Date(
    new Date().toLocaleString([], {
      timeZone: region,
    })
  );
  return date;
};
