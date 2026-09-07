import { useQuery } from '@tanstack/react-query';
import { getNotice, getNotices, type NoticeListParams } from '@/services/notices.service';

export function useNotices(params: NoticeListParams = {}) {
  return useQuery({
    queryKey: ['notices', params],
    queryFn: () => getNotices(params),
  });
}

export function useNotice(id: string) {
  return useQuery({
    queryKey: ['notices', 'detail', id],
    queryFn: () => getNotice(id),
    enabled: id.length > 0,
  });
}
