export const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    if (!res.ok) {
      const error: any = new Error('Fetching Data Error');
      const result = await res.json();
      error.message = result?.message;
      error.status = res.status;
      throw error;
    }
    return res.json();
  });
