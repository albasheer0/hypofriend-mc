<template>
  <v-app>
    <v-row class="ma-3">
      <!--  loan calculator form start -->
      <v-col cols="12" md="6">
        <v-card :loading="loading" class="pa-3">
          <v-form id="form" ref="form" @submit.prevent="submitForm">
            <v-row>
              <v-col cols="12" md="6">
                <h4 class="mb-3">Property Purchase Price</h4>

                <v-text-field
                  id="property-purchase-price"
                  v-model.number="propertyPrice"
                  type="number"
                  @keyup="submitForm"
                  prepend-inner-icon="mdi-currency-eur"
                  :rules="inputRule('Property Purchase Price ', 50000, 1000000)"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <h4 class="mb-3">Total savings</h4>
                <v-text-field
                  id="total-savings"
                  v-model.number="totalSavings"
                  type="number"
                  @keyup="submitForm"
                  prepend-inner-icon="mdi-currency-eur"
                  :rules="inputRule('Total Savings ', 1000, 1000000)"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <h4 class="mb-3">Real estate commission</h4>
                <v-select
                  id="realEstateCommission"
                  v-model="realEstateCommission"
                  @update:modelValue="submitForm"
                  :items="['Yes', 'No']"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-row class="mb-3 mx-0">
                  <h4>Annual repayment rate</h4>
                  <v-spacer></v-spacer>
                  <h5>{{ annualRepaymentRate }} %</h5>
                </v-row>
                <v-slider
                  id="slider"
                  v-model="annualRepaymentRate"
                  color="primary"
                  @update:modelValue="submitForm"
                  prepend-icon="mdi-present"
                  track-color="grey"
                  min="1"
                  max="5"
                  :step="0.5"
                >
                  <template v-slot:prepend>
                    <v-btn
                      size="small"
                      variant="text"
                      icon
                      color="primary"
                      @click="annualRepaymentRateMod(false)"
                    >
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>
                  </template>

                  <template v-slot:append>
                    <v-btn
                      size="small"
                      variant="text"
                      icon
                      color="primary"
                      @click="annualRepaymentRateMod(true)"
                    >
                      <v-icon>mdi-plus</v-icon></v-btn
                    >
                  </template>
                </v-slider>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-alert
              class="mt-6"
              density="compact"
              closable
              id="alert"
              v-model="alert"
              v-if="formError"
              type="error"
            >
              {{ formError }}</v-alert
            >
            <v-row class="mt-7 mx-3 mb-3">
              <v-spacer></v-spacer>
              <v-btn
                type="submit"
                id="submit"
                :loading="loading"
                color="#1b8391"
              >
                <span class="text--white white--text text--accent-3">
                  Calculate</span
                >
              </v-btn>
            </v-row>
          </v-form>
        </v-card>
      </v-col>
      <!--  loan calculator form end -->

      <v-col cols="12" md="6">
        <!--  Implied loan and Loan to value cards start -->
        <v-row>
          <v-col cols="12" md="6">
            <v-card :loading="loading">
              <v-card-title>Implied loan</v-card-title>
              <h1 class="pa-3 implied-loan">{{ impliedLoan }}</h1>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card :loading="loading">
              <v-card-title>Loan to value</v-card-title>
              <h1 class="pa-3 loan-to-value">{{ loanToValue }}</h1>
            </v-card>
          </v-col>
        </v-row>
        <!--  Implied loan and Loan to value cards end -->

        <!--   loans info start -->

        <v-row>
          <v-col cols="12">
            <v-card :loading="loading">
              <v-simple-table class="mt-3 loans-info" fixed-header>
                <thead>
                  <tr>
                    <th
                      v-for="(header, index) in headers"
                      :key="index"
                      class="text-left"
                    >
                      {{ header }}
                    </th>
                  </tr>
                </thead>
                <tbody v-if="loans">
                  <tr v-for="(item, index) in loans" :key="index">
                    <td>{{ index }} Years</td>
                    <td>{{ item.borrowingRate || "" }} %</td>
                    <td>
                      {{
                        item.monthlyRate.toLocaleString("de-DE", {
                          style: "currency",
                          currency: "EUR",
                        })
                      }}
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr v-for="item in 6" :key="item">
                    <td>{{ item * 5 }} Years</td>
                    <td>0%</td>
                    <td>0,00 €</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card>
          </v-col>
        </v-row>

        <!--   loans info end -->
      </v-col>
    </v-row>
  </v-app>
</template>
<script>
import { gql } from "graphql-tag";

export default {
  data() {
    return {
      alert: false,
      loading: false,
      formValid: false,
      headers: ["Fixation Years", "Interest Rate", "Monthly Payment"],
      realEstateCommission: "Yes",
      propertyPrice: 110000,
      totalSavings: 5000,
      annualRepaymentRate: 1,
      formError: "",
      brokerTax: 0.0714,
      cityTax: 0.06,
      loans: null,
    };
  },
async mounted(){
await this.submitForm()
},
  computed: {
    // to resolve the real Estate Commission input
    realEstateCommissionResolver() {
      return this.realEstateCommission === "Yes";
    },
    notaryCosts() {
      return 2144.0 + 0.013 * (this.propertyPrice - 100000.0);
    },
    brokerCosts() {
      if (this.realEstateCommissionResolver) {
        return this.brokerTax * this.propertyPrice;
      }

      return 0;
    },
    stampDutyCosts() {
      return this.cityTax * this.propertyPrice;
    },
    totalCosts() {
      return this.notaryCosts + this.brokerCosts + this.stampDutyCosts;
    },
    rawLoanAmount() {
      return this.totalCosts - this.totalSavings + this.propertyPrice;
    },
    impliedLoan() {
      return this.rawLoanAmount.toLocaleString("de-DE", {
        style: "currency",
        currency: "EUR",
      });
      //      return this.formValid
      //        ? this.rawLoanAmount.toLocaleString("de-DE", {
      //            style: "currency",
      //            currency: "EUR",
      //          })
      //        : "0,00 €";
    },
    loanToValue() {
      return `${((this.rawLoanAmount / this.propertyPrice) * 100).toFixed(
        2
      )} %`;
      //      return this.formValid
      //        ? `${((this.rawLoanAmount / this.propertyPrice) * 100).toFixed(2)} %`
      //        : "0 %";
    },
  },
  methods: {
    // function to update the annual Repayment Rate slider value using plus and minus buttons
    async annualRepaymentRateMod(plus) {
      if (plus) {
        if (this.annualRepaymentRate < 5) {
          this.annualRepaymentRate += 0.5;
          await this.submitForm();
          return this.annualRepaymentRate;
        }
        return {};
      }
      if (this.annualRepaymentRate > 1) {
        this.annualRepaymentRate -= 0.5;
        await this.submitForm();
        return this.annualRepaymentRate;
      }
    },
    inputRule(fieldName, min, max) {
      return [
        (v) => !!v || `${fieldName} is required`,
        (v) => (!isNaN(v) && isFinite(v)) || `${fieldName} must be a number`,
        (v) =>
          v >= min || `${fieldName} must be greater than or equal to ${min}`,
        (v) => v <= max || `${fieldName} must be less than or equal to ${max}`,
      ];
    },
    async submitForm() {
      this.loading = true;
      const valid = await this.$refs.form?.validate();
      console.log(valid);
      this.formValid = valid;
      if (valid) {
        this.alert = false;
        try {
          const yearsFixed = [5, 10, 15, 20, 25, 30];
          const variables = {
            propertyPrice: parseFloat(this.propertyPrice.toFixed(1)),
            repayment: parseFloat(this.annualRepaymentRate.toFixed(1)),
            loanAmount: parseFloat(this.rawLoanAmount.toFixed(1)),
            yearsFixed,
          };

          const { data } = await this.$apollo.query({
            query: gql`
              query GetRates(
                $propertyPrice: Float!
                $repayment: Float!
                $loanAmount: Float!
                $yearsFixed: [Int!]!
              ) {
                root {
                  rates_table(
                    property_price: $propertyPrice
                    repayment: $repayment
                    loan_amount: $loanAmount
                    years_fixed: $yearsFixed
                  )
                }
              }
            `,
            variables,
          });
          this.loans = data.root.ratesTable;

          console.log(this.loans);
        } catch (error) {
          console.log(error);
        }
      } else {
        this.alert = true;
        this.formError =
          "Please fill all the required fields with correct data";
      }
      this.loading = false;
    },
  },
};
</script>
