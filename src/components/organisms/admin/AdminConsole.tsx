"use client";

import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  ClipboardList,
  Eye,
  EyeOff,
  Grid2X2,
  LayoutDashboard,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  X,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Badge, Button, Input, Textarea } from "@/components/atoms";
import { useRequireAdmin } from "@/hooks/useRequireAdmin";
import { formatDateShort, formatDateTime } from "@/lib/format";
import {
  AdminApiRequestError,
  answerAdminInquiry,
  createAdminUser,
  fetchAdminInquiries,
  fetchAdminPosts,
  fetchAdminSummary,
  fetchAdminUsers,
  hideAdminPost,
  unhideAdminPost,
  updateAdminUser,
} from "@/services/adminApi";
import { fetchMonitoredCctvs } from "@/services/cctvApi";
import { CctvPlayer } from "@/components/organisms/LiveCctvDashboard";
import type {
  AdminInquiriesResponse,
  AdminPost,
  AdminPostsResponse,
  AdminRole,
  AdminSummary,
  AdminUser,
  AdminUserPayload,
  AdminUsersResponse,
} from "@/types/admin";
import type { BoardType } from "@/types/board";
import type { Cctv } from "@/types/cctv";

const PAGE_SIZE = 10;
const EMPTY_FORM: AdminUserPayload = {
  email: "",
  name: "",
  password: "",
  role: "viewer",
  department: "",
  phone: "",
  is_active: true,
};

const ROLE_OPTIONS: Array<{ value: AdminRole; label: string }> = [
  { value: "admin", label: "관리자" },
  { value: "operator", label: "운영자" },
  { value: "viewer", label: "사용자" },
];

const BOARD_LABELS: Record<BoardType, string> = {
  notice: "공지",
  bug: "버그",
  inquiry: "문의",
};

type Tab = "overview" | "monitor" | "users" | "posts" | "inquiries";

export function AdminConsole() {
  const { isReady, accessToken } = useRequireAdmin();
  const [activeTab, setActiveTab] = React.useState<Tab>("overview");
  const [summary, setSummary] = React.useState<AdminSummary | null>(null);
  const [users, setUsers] = React.useState<AdminUsersResponse | null>(null);
  const [posts, setPosts] = React.useState<AdminPostsResponse | null>(null);
  const [inquiries, setInquiries] = React.useState<AdminInquiriesResponse | null>(null);
  const [monitoredCctvs, setMonitoredCctvs] = React.useState<Cctv[]>([]);
  const [selectedCctv, setSelectedCctv] = React.useState<Cctv | null>(null);
  const [selectedUser, setSelectedUser] = React.useState<AdminUser | null>(null);
  const [userForm, setUserForm] = React.useState<AdminUserPayload>(EMPTY_FORM);
  const [answerDrafts, setAnswerDrafts] = React.useState<Record<number, string>>({});
  const [error, setError] = React.useState("");
  const [notice, setNotice] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [userFilters, setUserFilters] = React.useState({
    keyword: "",
    role: "all" as AdminRole | "all",
    active: "all" as "all" | "true" | "false",
    page: 1,
  });
  const [postFilters, setPostFilters] = React.useState({
    keyword: "",
    boardType: "all" as BoardType | "all",
    visibility: "all" as "all" | "visible" | "hidden",
    page: 1,
  });
  const [inquiryFilters, setInquiryFilters] = React.useState({
    keyword: "",
    status: "all" as "all" | "open" | "answered",
    page: 1,
  });
  const pendingCctvIdRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    const cctvId = params.get("cctvId");

    if (tab === "monitor") {
      pendingCctvIdRef.current = cctvId;
      window.setTimeout(() => setActiveTab("monitor"), 0);
    }
  }, []);

  const loadOverview = React.useCallback(async () => {
    if (!accessToken) return;
    setIsLoading(true);
    setError("");
    try {
      setSummary(await fetchAdminSummary(accessToken));
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  const loadUsers = React.useCallback(async () => {
    if (!accessToken) return;
    setIsLoading(true);
    setError("");
    try {
      setUsers(await fetchAdminUsers(accessToken, { ...userFilters, size: PAGE_SIZE }));
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, userFilters]);

  const loadPosts = React.useCallback(async () => {
    if (!accessToken) return;
    setIsLoading(true);
    setError("");
    try {
      setPosts(await fetchAdminPosts(accessToken, { ...postFilters, size: PAGE_SIZE }));
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, postFilters]);

  const loadInquiries = React.useCallback(async () => {
    if (!accessToken) return;
    setIsLoading(true);
    setError("");
    try {
      setInquiries(await fetchAdminInquiries(accessToken, { ...inquiryFilters, size: PAGE_SIZE }));
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, inquiryFilters]);

  const loadMonitoredCctvs = React.useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchMonitoredCctvs();
      setMonitoredCctvs(data.items);
      setSelectedCctv((current) => {
        const pendingId = pendingCctvIdRef.current;
        const pendingMatch = pendingId ? data.items.find((item) => item.id === pendingId) : null;
        pendingCctvIdRef.current = null;
        return pendingMatch ?? current ?? data.items[0] ?? null;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "관제 CCTV 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!isReady) return;

    void Promise.resolve().then(() => {
      if (activeTab === "overview") return loadOverview();
      if (activeTab === "monitor") return loadMonitoredCctvs();
      if (activeTab === "users") return loadUsers();
      if (activeTab === "posts") return loadPosts();
      return loadInquiries();
    });
  }, [activeTab, isReady, loadOverview, loadMonitoredCctvs, loadUsers, loadPosts, loadInquiries]);

  function refreshCurrent() {
    if (activeTab === "overview") void loadOverview();
    if (activeTab === "monitor") void loadMonitoredCctvs();
    if (activeTab === "users") void loadUsers();
    if (activeTab === "posts") void loadPosts();
    if (activeTab === "inquiries") void loadInquiries();
  }

  function openUserForm(user?: AdminUser) {
    setSelectedUser(user ?? null);
    setUserForm(
      user
        ? {
            email: user.email,
            name: user.name,
            password: "",
            role: user.role,
            department: user.department ?? "",
            phone: user.phone ?? "",
            is_active: user.is_active,
          }
        : EMPTY_FORM,
    );
  }

  async function handleUserSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken) return;
    setNotice("");
    setError("");

    const payload = { ...userForm };
    if (!payload.password) delete payload.password;

    try {
      if (selectedUser) {
        await updateAdminUser(accessToken, selectedUser.id, payload);
        setNotice("회원 정보를 수정했습니다.");
      } else {
        await createAdminUser(accessToken, userForm);
        setNotice("신규 회원을 생성했습니다.");
      }
      openUserForm();
      await loadUsers();
      await loadOverview();
    } catch (err) {
      setError(toErrorMessage(err));
    }
  }

  async function handleToggleUser(user: AdminUser) {
    if (!accessToken) return;
    try {
      await updateAdminUser(accessToken, user.id, { is_active: !user.is_active });
      setNotice(user.is_active ? "계정을 비활성화했습니다." : "계정을 활성화했습니다.");
      await loadUsers();
      await loadOverview();
    } catch (err) {
      setError(toErrorMessage(err));
    }
  }

  async function handlePostVisibility(post: AdminPost) {
    if (!accessToken) return;
    try {
      if (post.is_hidden) {
        await unhideAdminPost(accessToken, post.id);
        setNotice("게시글을 다시 노출했습니다.");
      } else {
        await hideAdminPost(accessToken, post.id);
        setNotice(post.board_type === "inquiry" ? "문의를 종료 처리했습니다." : "게시글을 가렸습니다.");
      }
      await loadPosts();
      await loadInquiries();
      await loadOverview();
    } catch (err) {
      setError(toErrorMessage(err));
    }
  }

  async function handleAnswerInquiry(postId: number) {
    if (!accessToken) return;
    const content = (answerDrafts[postId] ?? "").trim();
    if (!content) {
      setError("답변 내용을 입력해주세요.");
      return;
    }

    try {
      await answerAdminInquiry(accessToken, postId, content);
      setAnswerDrafts((prev) => ({ ...prev, [postId]: "" }));
      setNotice("문의 답변을 등록했습니다.");
      await loadInquiries();
      await loadOverview();
    } catch (err) {
      setError(toErrorMessage(err));
    }
  }

  if (!isReady) {
    return (
      <section className="px-5 py-12">
        <p className="text-center text-sm font-bold text-slate-500 dark:text-warm-300">
          관리자 권한을 확인하는 중입니다.
        </p>
      </section>
    );
  }

  return (
    <section className="px-5 py-8 sm:px-8">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 lg:flex-row">
        <aside className="rounded-lg border border-warm-200 bg-warm-50 p-4 dark:border-slate-700 dark:bg-slate-800 lg:w-72 lg:shrink-0">
          <div className="mb-5">
            <p className="text-xs font-black uppercase text-flare-600 dark:text-flare-400">
              Admin Console
            </p>
            <h1 className="mt-2 text-2xl font-black text-slate-950 dark:text-cream-50">
              운영 관리자
            </h1>
          </div>
          <nav className="grid gap-2" aria-label="관리자 메뉴">
            {[
              { value: "overview", label: "대시보드", icon: LayoutDashboard },
              { value: "monitor", label: "CCTV 관제", icon: Camera },
              { value: "users", label: "회원 관리", icon: Users },
              { value: "posts", label: "게시판 관리", icon: ClipboardList },
              { value: "inquiries", label: "문의 관리", icon: MessageSquare },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.value}
                  type="button"
                  className={`flex h-11 items-center gap-3 rounded-md px-3 text-sm font-black transition-colors ${
                    activeTab === item.value
                      ? "bg-flare-500 text-white"
                      : "text-slate-600 hover:bg-warm-100 dark:text-warm-200 dark:hover:bg-slate-700"
                  }`}
                  onClick={() => {
                    setError("");
                    setNotice("");
                    setActiveTab(item.value as Tab);
                  }}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-black uppercase text-flare-600 dark:text-flare-400">
                Admin Console
              </p>
              <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-cream-50">
                {tabTitle(activeTab)}
              </h2>
              <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-warm-300">
                회원 동기화 보정, 게시글 노출, 문의 답변을 처리합니다.
              </p>
            </div>
            <Button type="button" variant="outline" onClick={refreshCurrent} disabled={isLoading}>
              <RefreshCw className="size-4" aria-hidden="true" />
              새로고침
            </Button>
          </div>

          {error ? <Alert tone="danger" label={error} /> : null}
          {notice ? <Alert tone="success" label={notice} /> : null}

          {activeTab === "overview" ? <OverviewPanel summary={summary} isLoading={isLoading} /> : null}
          {activeTab === "monitor" ? (
            <MonitorPanel
              cctvs={monitoredCctvs}
              selectedCctv={selectedCctv}
              isLoading={isLoading}
              onSelect={setSelectedCctv}
            />
          ) : null}
          {activeTab === "users" ? (
            <UsersPanel
              data={users}
              filters={userFilters}
              form={userForm}
              selectedUser={selectedUser}
              isLoading={isLoading}
              onFiltersChange={setUserFilters}
              onFormChange={setUserForm}
              onOpenUser={openUserForm}
              onSubmit={handleUserSubmit}
              onToggleUser={handleToggleUser}
            />
          ) : null}
          {activeTab === "posts" ? (
            <PostsPanel
              data={posts}
              filters={postFilters}
              isLoading={isLoading}
              onFiltersChange={setPostFilters}
              onToggleVisibility={handlePostVisibility}
            />
          ) : null}
          {activeTab === "inquiries" ? (
            <InquiriesPanel
              data={inquiries}
              filters={inquiryFilters}
              drafts={answerDrafts}
              isLoading={isLoading}
              onFiltersChange={setInquiryFilters}
              onDraftChange={(postId, content) =>
                setAnswerDrafts((prev) => ({ ...prev, [postId]: content }))
              }
              onAnswer={handleAnswerInquiry}
              onToggleVisibility={handlePostVisibility}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}

function OverviewPanel({
  summary,
  isLoading,
}: {
  summary: AdminSummary | null;
  isLoading: boolean;
}) {
  if (isLoading && !summary) return <LoadingText label="대시보드를 불러오는 중입니다." />;
  if (!summary) return <EmptyText label="표시할 운영 지표가 없습니다." />;

  const metrics = [
    { label: "전체 회원", value: summary.metrics.total_users, icon: Users },
    { label: "활성 회원", value: summary.metrics.active_users, icon: UserCheck },
    { label: "전체 게시글", value: summary.metrics.total_posts, icon: ClipboardList },
    { label: "미답변 문의", value: summary.metrics.open_inquiries, icon: MessageSquare },
    { label: "가려진 게시글", value: summary.metrics.hidden_posts, icon: EyeOff },
    { label: "가려진 댓글", value: summary.metrics.hidden_comments, icon: ShieldCheck },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="rounded-lg border border-warm-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-500 dark:text-warm-300">{metric.label}</p>
                  <p className="mt-2 text-3xl font-black text-slate-950 dark:text-cream-50">
                    {metric.value.toLocaleString()}
                  </p>
                </div>
                <span className="flex size-11 items-center justify-center rounded-md bg-flare-500/12 text-flare-600 dark:text-flare-400">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <AdminList title="최근 문의" posts={summary.latest_inquiries} />
        <AdminList title="최근 게시글" posts={summary.latest_posts} />
      </div>
    </div>
  );
}

function MonitorPanel({
  cctvs,
  selectedCctv,
  isLoading,
  onSelect,
}: {
  cctvs: Cctv[];
  selectedCctv: Cctv | null;
  isLoading: boolean;
  onSelect: (cctv: Cctv) => void;
}) {
  const [isFullscreenOpen, setIsFullscreenOpen] = React.useState(false);
  const fullscreenRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isFullscreenOpen) return;

    fullscreenRef.current?.requestFullscreen?.().catch(() => {
      // 브라우저 전체화면이 차단되어도 fixed 오버레이로 관제 화면은 유지된다.
    });

    function handleFullscreenChange() {
      if (!document.fullscreenElement) {
        setIsFullscreenOpen(false);
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [isFullscreenOpen]);

  function closeFullscreen() {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    }
    setIsFullscreenOpen(false);
  }

  if (isLoading && cctvs.length === 0) {
    return <LoadingText label="관제 CCTV를 불러오는 중입니다." />;
  }

  if (cctvs.length === 0) {
    return <EmptyText label="관제할 CCTV가 없습니다." />;
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="min-w-0 overflow-hidden rounded-lg border border-warm-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-warm-200 p-4 dark:border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase text-flare-600 dark:text-flare-400">
                Live Monitor
              </p>
              <h3 className="mt-1 truncate text-xl font-black text-slate-950 dark:text-cream-50">
                {selectedCctv?.name ?? "CCTV 선택"}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-2 rounded-full bg-danger-critical/10 px-3 py-1.5 text-xs font-black text-danger-critical">
                <span className="size-2 rounded-full bg-danger-critical" />
                실시간 관제
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="font-bold"
                onClick={() => setIsFullscreenOpen(true)}
              >
                <Grid2X2 className="size-4" aria-hidden="true" />
                전체화면 보기
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-slate-950 p-4">
          <CctvPlayer cctv={selectedCctv} />
        </div>
      </div>

      <aside className="rounded-lg border border-warm-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-slate-950 dark:text-cream-50">
              WORKER 관제 CCTV
            </h3>
            <p className="mt-1 text-xs font-bold text-slate-500 dark:text-warm-300">
              선택된 터널 CCTV {cctvs.length}대를 확인합니다.
            </p>
          </div>
          <AlertTriangle className="size-5 shrink-0 text-flare-600 dark:text-flare-400" aria-hidden="true" />
        </div>

        <div className="grid gap-3">
          {cctvs.map((cctv) => {
            const selected = selectedCctv?.id === cctv.id;

            return (
              <button
                key={cctv.id}
                type="button"
                className={`w-full rounded-lg border p-3 text-left transition-colors ${
                  selected
                    ? "border-flare-500 bg-flare-500/10"
                    : "border-warm-200 hover:bg-warm-50 dark:border-slate-800 dark:hover:bg-slate-800"
                }`}
                onClick={() => onSelect(cctv)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-950 dark:text-cream-50">
                      {cctv.name}
                    </p>
                    <p className="mt-1 truncate text-xs font-bold text-slate-500 dark:text-warm-300">
                      {cctv.roadName || "도로 정보 없음"}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-black ${
                    cctv.streamUrl
                      ? "bg-process-resolved/10 text-process-resolved"
                      : "bg-danger-critical/10 text-danger-critical"
                  }`}>
                    {cctv.streamUrl ? "LIVE" : "OFF"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {isFullscreenOpen ? (
        <FullscreenMonitor
          cctvs={cctvs}
          fullscreenRef={fullscreenRef}
          onClose={closeFullscreen}
        />
      ) : null}
    </div>
  );
}

function FullscreenMonitor({
  cctvs,
  fullscreenRef,
  onClose,
}: {
  cctvs: Cctv[];
  fullscreenRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
}) {
  return (
    <div
      ref={fullscreenRef}
      className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-cream-50"
    >
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-800 px-5 py-4">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase text-flare-400">
            Control Center
          </p>
          <h3 className="mt-1 truncate text-2xl font-black">
            WORKER CCTV 통합 관제
          </h3>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden items-center gap-2 rounded-full bg-danger-critical/15 px-3 py-1.5 text-xs font-black text-danger-critical sm:flex">
            <span className="size-2 rounded-full bg-danger-critical" />
            {cctvs.length}대 실시간 감시
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-10 rounded-full text-cream-50 hover:bg-slate-800"
            aria-label="전체화면 닫기"
            title="전체화면 닫기"
            onClick={onClose}
          >
            <X className="size-5" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 p-4">
        <div className="grid h-full min-h-0 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {cctvs.map((cctv) => (
            <div
              key={cctv.id}
              className="min-h-0 overflow-hidden rounded-lg border border-slate-800 bg-slate-950 shadow-sm"
            >
              <CctvPlayer cctv={cctv} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UsersPanel({
  data,
  filters,
  form,
  selectedUser,
  isLoading,
  onFiltersChange,
  onFormChange,
  onOpenUser,
  onSubmit,
  onToggleUser,
}: {
  data: AdminUsersResponse | null;
  filters: { keyword: string; role: AdminRole | "all"; active: "all" | "true" | "false"; page: number };
  form: AdminUserPayload;
  selectedUser: AdminUser | null;
  isLoading: boolean;
  onFiltersChange: React.Dispatch<React.SetStateAction<{ keyword: string; role: AdminRole | "all"; active: "all" | "true" | "false"; page: number }>>;
  onFormChange: React.Dispatch<React.SetStateAction<AdminUserPayload>>;
  onOpenUser: (user?: AdminUser) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onToggleUser: (user: AdminUser) => void;
}) {
  const isSocialUser = Boolean(selectedUser && selectedUser.provider !== "local");

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <div className="min-w-0 space-y-4">
        <FilterBar keyword={filters.keyword} onKeywordChange={(keyword) => onFiltersChange((prev) => ({ ...prev, keyword, page: 1 }))}>
          <RoleSelect value={filters.role} onChange={(role) => onFiltersChange((prev) => ({ ...prev, role, page: 1 }))} includeAll />
          <select value={filters.active} onChange={(event) => onFiltersChange((prev) => ({ ...prev, active: event.target.value as "all" | "true" | "false", page: 1 }))} className="h-10 rounded-md border border-input bg-background px-3 text-sm font-bold">
            <option value="all">전체 상태</option>
            <option value="true">활성</option>
            <option value="false">비활성</option>
          </select>
        </FilterBar>
        {isLoading && !data ? <LoadingText label="회원을 불러오는 중입니다." /> : null}
        {data ? <UserTable users={data.users} onOpenUser={onOpenUser} onToggleUser={onToggleUser} /> : null}
        <Pagination pagination={data?.pagination} onPageChange={(page) => onFiltersChange((prev) => ({ ...prev, page }))} />
      </div>
      <form onSubmit={onSubmit} className="space-y-3 rounded-lg border border-warm-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-black text-slate-950 dark:text-cream-50">
            {selectedUser ? "회원 정보 수정" : "신규 회원 생성"}
          </h3>
          <Button type="button" variant="ghost" size="sm" onClick={() => onOpenUser()}>
            <Plus className="size-4" aria-hidden="true" />
            신규
          </Button>
        </div>
        <Input value={form.email} onChange={(event) => onFormChange((prev) => ({ ...prev, email: event.target.value }))} placeholder="이메일" required />
        <Input value={form.name} onChange={(event) => onFormChange((prev) => ({ ...prev, name: event.target.value }))} placeholder="이름" required />
        <Input
          value={isSocialUser ? "" : form.password ?? ""}
          onChange={(event) => onFormChange((prev) => ({ ...prev, password: event.target.value }))}
          placeholder={isSocialUser ? "소셜 로그인 계정은 변경 불가" : selectedUser ? "새 비밀번호(선택)" : "초기 비밀번호"}
          type="password"
          required={!selectedUser}
          disabled={isSocialUser}
        />
        {isSocialUser ? (
          <p className="text-xs font-bold text-slate-500 dark:text-warm-300">
            {providerLabel(selectedUser?.provider ?? "")} 계정은 비밀번호를 서비스에서 관리하지 않습니다.
          </p>
        ) : null}
        <RoleSelect value={form.role} onChange={(role) => onFormChange((prev) => ({ ...prev, role: role as AdminRole }))} />
        <Input value={form.department ?? ""} onChange={(event) => onFormChange((prev) => ({ ...prev, department: event.target.value }))} placeholder="부서" />
        <Input value={form.phone ?? ""} onChange={(event) => onFormChange((prev) => ({ ...prev, phone: event.target.value }))} placeholder="연락처" />
        <label className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-warm-200">
          <input type="checkbox" checked={form.is_active} onChange={(event) => onFormChange((prev) => ({ ...prev, is_active: event.target.checked }))} />
          활성 계정
        </label>
        <Button type="submit" className="w-full bg-flare-500 font-bold hover:bg-flare-600">
          <CheckCircle2 className="size-4" aria-hidden="true" />
          {selectedUser ? "수정 저장" : "회원 생성"}
        </Button>
      </form>
    </div>
  );
}

function PostsPanel({
  data,
  filters,
  isLoading,
  onFiltersChange,
  onToggleVisibility,
}: {
  data: AdminPostsResponse | null;
  filters: { keyword: string; boardType: BoardType | "all"; visibility: "all" | "visible" | "hidden"; page: number };
  isLoading: boolean;
  onFiltersChange: React.Dispatch<React.SetStateAction<{ keyword: string; boardType: BoardType | "all"; visibility: "all" | "visible" | "hidden"; page: number }>>;
  onToggleVisibility: (post: AdminPost) => void;
}) {
  return (
    <div className="space-y-4">
      <FilterBar keyword={filters.keyword} onKeywordChange={(keyword) => onFiltersChange((prev) => ({ ...prev, keyword, page: 1 }))}>
        <BoardSelect value={filters.boardType} onChange={(boardType) => onFiltersChange((prev) => ({ ...prev, boardType, page: 1 }))} />
        <VisibilitySelect value={filters.visibility} onChange={(visibility) => onFiltersChange((prev) => ({ ...prev, visibility, page: 1 }))} />
      </FilterBar>
      {isLoading && !data ? <LoadingText label="게시글을 불러오는 중입니다." /> : null}
      {data ? <PostTable posts={data.posts} onToggleVisibility={onToggleVisibility} /> : null}
      <Pagination pagination={data?.pagination} onPageChange={(page) => onFiltersChange((prev) => ({ ...prev, page }))} />
    </div>
  );
}

function InquiriesPanel({
  data,
  filters,
  drafts,
  isLoading,
  onFiltersChange,
  onDraftChange,
  onAnswer,
  onToggleVisibility,
}: {
  data: AdminInquiriesResponse | null;
  filters: { keyword: string; status: "all" | "open" | "answered"; page: number };
  drafts: Record<number, string>;
  isLoading: boolean;
  onFiltersChange: React.Dispatch<React.SetStateAction<{ keyword: string; status: "all" | "open" | "answered"; page: number }>>;
  onDraftChange: (postId: number, content: string) => void;
  onAnswer: (postId: number) => void;
  onToggleVisibility: (post: AdminPost) => void;
}) {
  return (
    <div className="space-y-4">
      <FilterBar keyword={filters.keyword} onKeywordChange={(keyword) => onFiltersChange((prev) => ({ ...prev, keyword, page: 1 }))}>
        <select value={filters.status} onChange={(event) => onFiltersChange((prev) => ({ ...prev, status: event.target.value as "all" | "open" | "answered", page: 1 }))} className="h-10 rounded-md border border-input bg-background px-3 text-sm font-bold">
          <option value="all">전체 상태</option>
          <option value="open">미답변</option>
          <option value="answered">답변완료</option>
        </select>
      </FilterBar>
      {isLoading && !data ? <LoadingText label="문의를 불러오는 중입니다." /> : null}
      {data ? (
        data.inquiries.length > 0 ? (
          <div className="grid gap-3">
            {data.inquiries.map((post) => (
              <div key={post.id} className="rounded-lg border border-warm-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap gap-2">
                      <Badge variant={post.inquiry_status === "open" ? "secondary" : "default"}>{post.inquiry_status === "open" ? "미답변" : "답변완료"}</Badge>
                      {post.is_hidden ? <Badge variant="destructive">종료</Badge> : <Badge variant="outline">진행중</Badge>}
                    </div>
                    <Link href={`/inquiries/${post.id}`} className="block truncate text-base font-black text-slate-950 hover:text-flare-600 dark:text-cream-50 dark:hover:text-flare-400">
                      {post.title}
                    </Link>
                    <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-warm-300">
                      {post.author_name} · {post.author_email} · {post.created_at ? formatDateTime(post.created_at) : "-"}
                    </p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => onToggleVisibility(post)}>
                    {post.is_hidden ? <Eye className="size-4" aria-hidden="true" /> : <EyeOff className="size-4" aria-hidden="true" />}
                    {post.is_hidden ? "재개" : "종료"}
                  </Button>
                </div>
                <div className="mt-4 grid gap-2 md:grid-cols-[1fr_auto]">
                  <Textarea value={drafts[post.id] ?? ""} onChange={(event) => onDraftChange(post.id, event.target.value)} placeholder="관리자 답변을 입력하세요" className="min-h-24" />
                  <Button type="button" className="bg-flare-500 font-bold hover:bg-flare-600 md:self-end" onClick={() => onAnswer(post.id)}>
                    <Send className="size-4" aria-hidden="true" />
                    답변 등록
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyText label="조건에 맞는 문의가 없습니다." />
        )
      ) : null}
      <Pagination pagination={data?.pagination} onPageChange={(page) => onFiltersChange((prev) => ({ ...prev, page }))} />
    </div>
  );
}

function UserTable({
  users,
  onOpenUser,
  onToggleUser,
}: {
  users: AdminUser[];
  onOpenUser: (user: AdminUser) => void;
  onToggleUser: (user: AdminUser) => void;
}) {
  if (users.length === 0) return <EmptyText label="조건에 맞는 회원이 없습니다." />;

  return (
    <div className="overflow-x-auto rounded-lg border border-warm-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <table className="w-full min-w-[900px] table-fixed text-sm">
        <thead>
          <tr className="border-b border-warm-200 text-left text-xs font-black text-slate-500 dark:border-slate-800 dark:text-warm-300">
            <th className="w-64 px-4 py-3">회원</th>
            <th className="w-28 px-4 py-3">역할</th>
            <th className="w-24 px-4 py-3">상태</th>
            <th className="px-4 py-3">부서/연락처</th>
            <th className="w-28 px-4 py-3">가입일</th>
            <th className="w-44 px-4 py-3 text-right">관리</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-warm-200 dark:divide-slate-800">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-3">
                <p className="truncate font-black text-slate-950 dark:text-cream-50">{user.name}</p>
                <p className="truncate text-xs font-semibold text-slate-500 dark:text-warm-300">{user.email}</p>
              </td>
              <td className="px-4 py-3 text-xs font-black">{roleLabel(user.role)}</td>
              <td className="px-4 py-3"><StatusBadge active={user.is_active} /></td>
              <td className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-warm-300">
                <p className="truncate">{user.department || "부서 없음"}</p>
                <p className="truncate">{user.phone || "연락처 없음"}</p>
              </td>
              <td className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-warm-300">{user.created_at ? formatDateShort(user.created_at) : "-"}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => onOpenUser(user)}>상세/수정</Button>
                  <Button type="button" variant={user.is_active ? "outline" : "default"} size="sm" onClick={() => onToggleUser(user)}>
                    {user.is_active ? "비활성" : "활성"}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PostTable({ posts, onToggleVisibility }: { posts: AdminPost[]; onToggleVisibility: (post: AdminPost) => void }) {
  if (posts.length === 0) return <EmptyText label="조건에 맞는 게시글이 없습니다." />;

  return (
    <div className="overflow-x-auto rounded-lg border border-warm-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <table className="w-full min-w-[900px] table-fixed text-sm">
        <thead>
          <tr className="border-b border-warm-200 text-left text-xs font-black text-slate-500 dark:border-slate-800 dark:text-warm-300">
            <th className="w-24 px-4 py-3">게시판</th>
            <th className="px-4 py-3">제목</th>
            <th className="w-48 px-4 py-3">작성자</th>
            <th className="w-28 px-4 py-3">상태</th>
            <th className="w-24 px-4 py-3">반응</th>
            <th className="w-28 px-4 py-3">작성일</th>
            <th className="w-32 px-4 py-3 text-right">관리</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-warm-200 dark:divide-slate-800">
          {posts.map((post) => (
            <tr key={post.id}>
              <td className="px-4 py-3"><Badge variant="secondary">{BOARD_LABELS[post.board_type]}</Badge></td>
              <td className="px-4 py-3">
                <Link href={`/${boardPath(post.board_type)}/${post.id}`} className="block truncate font-black text-slate-950 hover:text-flare-600 dark:text-cream-50 dark:hover:text-flare-400">{post.title}</Link>
              </td>
              <td className="px-4 py-3">
                <p className="truncate text-xs font-bold text-slate-700 dark:text-warm-200">{post.author_name}</p>
                <p className="truncate text-xs font-semibold text-slate-500 dark:text-warm-300">{post.author_email}</p>
              </td>
              <td className="px-4 py-3">{post.is_hidden ? <Badge variant="destructive">가려짐</Badge> : <Badge variant="outline">노출</Badge>}</td>
              <td className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-warm-300">조회 {post.view_count}<br />댓글 {post.comment_count}</td>
              <td className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-warm-300">{post.created_at ? formatDateShort(post.created_at) : "-"}</td>
              <td className="px-4 py-3 text-right">
                <Button type="button" variant="outline" size="sm" onClick={() => onToggleVisibility(post)}>
                  {post.is_hidden ? <Eye className="size-4" aria-hidden="true" /> : <EyeOff className="size-4" aria-hidden="true" />}
                  {post.is_hidden ? "해제" : "가리기"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FilterBar({ keyword, onKeywordChange, children }: { keyword: string; onKeywordChange: (keyword: string) => void; children?: React.ReactNode }) {
  return (
    <form className="flex flex-col gap-2 rounded-lg border border-warm-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:flex-row" onSubmit={(event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      onKeywordChange(String(formData.get("keyword") ?? "").trim());
    }}>
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <Input name="keyword" defaultValue={keyword} placeholder="이름, 이메일, 제목, 내용을 검색하세요" className="h-10 pl-9" />
      </div>
      {children}
      <Button type="submit" className="h-10 bg-flare-500 font-bold hover:bg-flare-600">검색</Button>
    </form>
  );
}

function AdminList({ title, posts }: { title: string; posts: AdminPost[] }) {
  return (
    <div className="rounded-lg border border-warm-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-lg font-black text-slate-950 dark:text-cream-50">{title}</h3>
      <div className="mt-4 divide-y divide-warm-200 dark:divide-slate-800">
        {posts.length > 0 ? posts.map((post) => (
          <Link key={post.id} href={`/${boardPath(post.board_type)}/${post.id}`} className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-slate-950 dark:text-cream-50">{post.title}</p>
              <p className="mt-1 truncate text-xs font-semibold text-slate-500 dark:text-warm-300">
                {BOARD_LABELS[post.board_type]} · {post.author_name} · {post.created_at ? formatDateTime(post.created_at) : "-"}
              </p>
            </div>
            {post.inquiry_status === "open" ? <Badge variant="secondary">미답변</Badge> : <ShieldCheck className="size-4 shrink-0 text-process-resolved" />}
          </Link>
        )) : <p className="py-6 text-center text-sm font-bold text-slate-500 dark:text-warm-300">항목이 없습니다.</p>}
      </div>
    </div>
  );
}

function RoleSelect({ value, onChange, includeAll = false }: { value: AdminRole | "all"; onChange: (value: AdminRole | "all") => void; includeAll?: boolean }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value as AdminRole | "all")} className="h-10 rounded-md border border-input bg-background px-3 text-sm font-bold">
      {includeAll ? <option value="all">전체 역할</option> : null}
      {ROLE_OPTIONS.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
    </select>
  );
}

function BoardSelect({ value, onChange }: { value: BoardType | "all"; onChange: (value: BoardType | "all") => void }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value as BoardType | "all")} className="h-10 rounded-md border border-input bg-background px-3 text-sm font-bold">
      <option value="all">전체 게시판</option>
      <option value="notice">공지</option>
      <option value="bug">버그</option>
      <option value="inquiry">문의</option>
    </select>
  );
}

function VisibilitySelect({ value, onChange }: { value: "all" | "visible" | "hidden"; onChange: (value: "all" | "visible" | "hidden") => void }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value as "all" | "visible" | "hidden")} className="h-10 rounded-md border border-input bg-background px-3 text-sm font-bold">
      <option value="all">전체 노출</option>
      <option value="visible">노출</option>
      <option value="hidden">가려짐</option>
    </select>
  );
}

function Pagination({ pagination, onPageChange }: { pagination?: { current_page: number; total_pages: number } | null; onPageChange: (page: number) => void }) {
  if (!pagination || pagination.total_pages <= 1) return null;
  const start = Math.max(1, pagination.current_page - 2);
  const end = Math.min(pagination.total_pages, start + 4);

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: end - start + 1 }, (_, index) => start + index).map((page) => (
        <Button key={page} type="button" variant={page === pagination.current_page ? "default" : "outline"} size="sm" onClick={() => onPageChange(page)}>
          {page}
        </Button>
      ))}
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return active ? <Badge className="bg-process-resolved text-cream-50">활성</Badge> : <Badge variant="destructive">비활성</Badge>;
}

function Alert({ tone, label }: { tone: "danger" | "success"; label: string }) {
  return (
    <p className={`mb-4 rounded-lg px-4 py-3 text-sm font-bold ${tone === "danger" ? "bg-danger-critical/10 text-danger-critical" : "bg-process-resolved/10 text-process-resolved"}`}>
      {label}
    </p>
  );
}

function LoadingText({ label }: { label: string }) {
  return <p className="rounded-lg border border-dashed border-warm-300 p-8 text-center text-sm font-bold text-slate-500 dark:border-slate-800 dark:text-warm-300">{label}</p>;
}

function EmptyText({ label }: { label: string }) {
  return <p className="rounded-lg border border-dashed border-warm-300 p-8 text-center text-sm font-bold text-slate-500 dark:border-slate-800 dark:text-warm-300">{label}</p>;
}

function tabTitle(tab: Tab) {
  if (tab === "monitor") return "CCTV 관제";
  if (tab === "users") return "회원 관리";
  if (tab === "posts") return "게시판 관리";
  if (tab === "inquiries") return "문의 관리";
  return "운영 대시보드";
}

function roleLabel(role: AdminRole) {
  return ROLE_OPTIONS.find((item) => item.value === role)?.label ?? role;
}

function providerLabel(provider: string) {
  const labels: Record<string, string> = {
    google: "구글",
    naver: "네이버",
    kakao: "카카오",
    local: "이메일",
  };

  return labels[provider.toLowerCase()] ?? provider;
}

function boardPath(boardType: BoardType) {
  if (boardType === "notice") return "notices";
  if (boardType === "inquiry") return "inquiries";
  return "bugs";
}

function toErrorMessage(error: unknown) {
  if (error instanceof AdminApiRequestError) return error.message;
  if (error instanceof Error) return error.message;
  return "요청 처리 중 오류가 발생했습니다.";
}
