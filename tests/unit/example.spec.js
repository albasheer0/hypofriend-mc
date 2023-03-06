import { createLocalVue, shallowMount } from "@vue/test-utils";
import App from "@/App.vue";
import Vuetify from "vuetify";

const localVue = createLocalVue();
localVue.use(Vuetify);

describe("App.vue", () => {
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("renders the form with all fields", () => {
    const wrapper = shallowMount(App, {
      localVue,
      vuetify,
    });

    expect(wrapper.find("#property-purchase-price").exists()).toBe(true);
    expect(wrapper.find("#total-savings").exists()).toBe(true);
    expect(wrapper.find("#realEstateCommission").exists()).toBe(true);
    expect(wrapper.find("#slider").exists()).toBe(true);
    expect(wrapper.find("#submit").exists()).toBe(true);
  });

  it("form submits correctly", async () => {
    const wrapper = shallowMount(App, {
      localVue,
      vuetify,
    });

    await wrapper.find("#submit").trigger("click");
    expect(wrapper.find(".v-alert").exists()).toBe(false);
  });

  it("submits the form and displays the loan details correctly", async () => {
    const wrapper = shallowMount(App, {
      localVue,
      vuetify,
    });

    // fill the form with valid data
    await wrapper.find("#property-purchase-price").setData(110000);
    await wrapper.find("#total-savings").setData(5000);

    // submit the form
    await wrapper.find("#submit").trigger("click");

    // check that the form submission was successful
    expect(wrapper.find(".v-alert").exists()).toBe(false);

    // check that the loan details are displayed correctly
    expect(wrapper.find(".implied-loan").text()).toContain("121.728,00 €");
    expect(wrapper.find(".loan-to-value").text()).toContain("110.66 %");

    // check that the loan table has the correct number of rows
    expect(wrapper.findAll(".loans-info tbody tr").length).toBeGreaterThan(0);
  });

  it("displays an error message if the form submission fails", async () => {
    const wrapper = shallowMount(App, {
      localVue,
      vuetify,
    });

    // fill the form with invalid data
    await wrapper.find("#property-purchase-price").setData("0");
    await wrapper.find("#total-savings").setData("0");

    // submit the form
    await wrapper.find("#form").trigger("submit.prevent");

    // check that the form submission failed and the error message is displayed
    expect(wrapper.find("#alert").exists()).toBe(false);
  });
});
