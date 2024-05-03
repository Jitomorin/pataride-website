import Link from "next/link";
interface BreadcrumbProps {
  pageName: string;
  index?: string;
}
const Breadcrumb = ({ pageName, index }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {index === undefined ? (
        <>
          <h2 className="text-3xl font-semibold text-black dark:text-white">
            {pageName}
          </h2>
          <nav>
            <ol className="flex items-center gap-2">
              <li>
                <Link className="font-medium" href="/dashboard/home">
                  Dashboard /
                </Link>
              </li>
              <li className="font-medium text-primary">{pageName}</li>
            </ol>
          </nav>
        </>
      ) : (
        <>
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            {index}
          </h2>
          <nav>
            <ol className="flex items-center gap-2">
              <li>
                <Link className="font-medium" href="/dashboard/home">
                  Dashboard /
                </Link>
              </li>
              <li>
                <Link
                  className="font-medium"
                  href={`/dashboard/${index!.toLowerCase()}`}
                >
                  {`${index} /`}
                </Link>
              </li>
              <li className="font-medium text-primary">{pageName}</li>
            </ol>
          </nav>
        </>
      )}
    </div>
  );
};

export default Breadcrumb;
