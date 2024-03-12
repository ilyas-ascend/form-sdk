import { lazy } from "react";
import camelCase from "lodash/camelCase";
import { ESurveyIcon } from "../assets/SVG";
import FormService from "./FormService";
const FormBuilder = lazy(() => import("../add"));
const FormBuilderShow = lazy(() => import("../review"));
import SubmissionList from "../list/SubmissionList";

class Service {
  disable = false;
  formBuilderSideMenu = [];
  formBuilderRoutes = [];
  isAvailable = true;

  getListingPath = () => {
    let listLocation = window.location.pathname
      .split("/")
      .filter((i) => i)
      .slice(0, 2)
      .join("/");
    return listLocation;
  };

  async getForms() {
    const formBuilderSideMenu = [];
    if (this.isAvailable) {
      try {
        const {
          data: { data },
        } = await FormService.getAllForms();

        data
          .filter((item) => item.status)
          ?.forEach((item) => {
            formBuilderSideMenu.push({
              ...item,
              id: camelCase(item.name),
              title: item.name,
              titleAr: item.name,
              navLink: `/${item._id}/Form-Builder`,
              icon: () =>
                item.saved_icon ? (
                  <img
                    src={item.saved_icon}
                    width={30}
                    style={{ marginRight: 7 }}
                  />
                ) : (
                  ESurveyIcon
                ),
              isAuth: true,
              skipForQuickAdd: true,
              isAvailableForAll: true,
            });
          });
      } catch (error) {
        console.log("Esurvey issue: ", error);
      }
    }
    this.formBuilderSideMenu = formBuilderSideMenu;

    this.formBuilderRoutes = [
      {
        element: <FormBuilder key={"add"} />,
        path: "/:form_id/Form-Builder/Add",
        route: "Form-Builder",
        slug: "Form-Builder",
        title: "Form Builder Form",
        isForm: true,
      },
      {
        element: <FormBuilder key={"tasks"} />,
        path: "/:form_id/Form-Builder/Add/:task_id",
        route: "Form-Builder",
        slug: "Form-Builder",
        title: "Form Builder Form",
        isForm: true,
      },
      {
        element: <FormBuilder key={"edit"} />,
        path: "/:form_id/Form-Builder/:id/Edit",
        route: "Form-Builder",
        slug: "Form-Builder",
        title: "Form Builder Form",
        isForm: true,
      },
      {
        element: <FormBuilderShow key={"edit"} />,
        path: "/:form_id/Form-Builder/:task_id/task",
        route: "Form-Builder",
        slug: "Form-Builder",
        title: "Form Builder Form",
        isForm: true,
      },
      {
        element: <FormBuilderShow key={"show"} />,
        path: "/:form_id/Form-Builder/:id",
        route: "Form-Builder",
        slug: "Form-Builder",
        title: "Form Builder Details",
      },
      {
        element: <SubmissionList />,
        path: "/:id/Form-Builder",
        route: "Form-Builder",
        slug: "Form-Builder",
        title: "Form Builder Form",
      },
    ];
    return {
      formBuilderSideMenu: this.formBuilderSideMenu,
      formBuilderRoutes: this.formBuilderRoutes,
    };
  }
}
const DynamicRoutesService = new Service();
export default DynamicRoutesService;
