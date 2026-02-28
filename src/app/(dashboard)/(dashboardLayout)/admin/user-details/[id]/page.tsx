"use client";

import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Pencil,
  Mail,
  Phone,
  User as UserIcon,
  Wallet,
  Info,
  Calendar,
  Link2,
  CreditCard,
  UserCircle2,
} from "lucide-react";
import { useGetSingleUserQuery } from "@/redux/featured/user/userApi";
import type { User } from "@/types/User";

const UserDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { data: user, isLoading, error } = useGetSingleUserQuery(id ?? "");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-12 w-12 border-4 border-gray-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          Error Loading User
        </h2>
        <p className="text-gray-500">Could not find user details.</p>
        <Button
          onClick={() => router.push("/users")}
          className="bg-gray-900 hover:bg-gray-800 text-white"
        >
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl space-y-6">
        {/* Header - Responsive */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-gray-300 hover:bg-gray-100"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            User Details
          </h1>

          <Button
            onClick={() => router.push(`/users/${id}/edit`)}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white w-full sm:w-auto"
          >
            <Pencil className="h-4 w-4" />
            Edit User
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="overflow-hidden shadow-lg border border-gray-200">
          <CardHeader className="bg-gray-900 text-white">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-white shadow-lg">
                {user.image ? (
                  <AvatarImage src={user.image} alt={user.name} />
                ) : (
                  <AvatarFallback className="bg-white text-gray-900 text-2xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="text-center sm:text-left flex-1">
                <CardTitle className="text-2xl sm:text-3xl">
                  {user.name}
                </CardTitle>
                <CardDescription className="text-gray-300 text-base sm:text-lg mt-1">
                  {user.email}
                </CardDescription>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                  <Badge
                    className={`${
                      user.status === "active"
                        ? "bg-white text-gray-900"
                        : "bg-gray-700 text-white"
                    } shadow-md border-0`}
                  >
                    {user.status?.toUpperCase()}
                  </Badge>
                  <Badge className="bg-gray-700 text-white hover:bg-gray-600 shadow-md border-0">
                    {user.role?.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 bg-white">
            {/* Info Grid - Fully Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoItem
                icon={<UserCircle2 className="h-5 w-5" />}
                label="Full Name"
                value={user.name}
              />
              <InfoItem
                icon={<Mail className="h-5 w-5" />}
                label="Email"
                value={user.email}
              />
              <InfoItem
                icon={<Phone className="h-5 w-5" />}
                label="Contact No"
                value={user.contactNo || "Not provided"}
              />
              <InfoItem
                icon={<UserIcon className="h-5 w-5" />}
                label="Gender"
                value={user.gender ? capitalize(user.gender) : "Not specified"}
              />
              <InfoItem
                icon={<Info className="h-5 w-5" />}
                label="Role"
                value={capitalize(user.role || "")}
              />
              <InfoItem
                icon={<Wallet className="h-5 w-5" />}
                label="Wallet Points"
                value={user.walletPoint?.toString() || "0"}
              />
            </div>

            {/* Bio */}
            {user.bio && (
              <Section title="Bio">
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  {user.bio}
                </p>
              </Section>
            )}

            {/* Social Links */}
            {(user?.socials?.length ?? 0) > 0 && (
              <Section title="Social Links">
                <div className="flex flex-wrap gap-2">
                  {user!.socials!.map((link, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      asChild
                      className="flex items-center gap-2 border-gray-300 hover:bg-gray-100 text-xs sm:text-sm"
                    >
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        <Link2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="truncate max-w-[150px] sm:max-w-none">
                          {link}
                        </span>
                      </a>
                    </Button>
                  ))}
                </div>
              </Section>
            )}

            {/* Card Info */}
            {user.cardInfo && (
              <Section
                title="Card Information"
                icon={<CreditCard className="h-5 w-5 text-gray-900" />}
              >
                <pre className="text-xs sm:text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200 overflow-x-auto">
                  {JSON.stringify(user.cardInfo, null, 2)}
                </pre>
              </Section>
            )}

            {/* Timestamps */}
            <div className="border-t border-gray-200 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <Calendar className="h-4 w-4 text-gray-600 flex-shrink-0" />
                <span className="break-words">
                  <strong className="text-gray-900">Created:</strong>{" "}
                  {new Date(user.createdAt!).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <Calendar className="h-4 w-4 text-gray-600 flex-shrink-0" />
                <span className="break-words">
                  <strong className="text-gray-900">Updated:</strong>{" "}
                  {new Date(user.updatedAt!).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper Components
const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <Card className="p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
    <div className="flex items-center gap-2 text-gray-600 mb-2">
      {icon}
      <span className="text-xs sm:text-sm font-medium">{label}</span>
    </div>
    <p className="text-base sm:text-lg font-semibold text-gray-900 break-words">
      {value}
    </p>
  </Card>
);

const Section = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div>
    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
      {icon || <Info className="h-5 w-5 text-gray-900" />}
      {title}
    </h3>
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm">
      {children}
    </div>
  </div>
);

const capitalize = (text: string) =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : text;

export default UserDetailsPage;
