const express = require('express');
const app = express();
const oracledb = require('oracledb');
const port = 5000;
const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv").config();
app.use(bodyParser.json());
app.use(cors());



 app.post("/api/salary-upload", async (req, res) => {
  const {
    key,
    formCode,
    postedBy,
    batchNumber,
    jsonData,
    currencyCode,
    accountNumber,
    branchCode,
    debitNarration,
    creditNarration,
    scanDoc,
    terminalId,
    feeTax,
    feeCharge,
    transCode,
    allowDup,
  } = req.body;
  console.log(req.body);
  try {
    const connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECT_STRING,
    });
    if (key === "uploadNoFees") {
      // console.log("it is happening here ")
      // Delete existing data for the postedBy user
      await connection.execute(
        `delete from TBL_GENERAL_SAL_NOFEES where posted_by = :app_user`,
        {
          app_user: postedBy,
        },
        { autoCommit: true }
      );
      // Insert Data
      const insertData = jsonData.map(({ PIN, BBAN, AMOUNT }) => [
        postedBy,
        batchNumber,
        PIN,
        BBAN,
        AMOUNT,
      ]);
      // Insert data in batches
      const batchSize = 1000; // Adjust the batch size as needed
      for (let i = 0; i < insertData.length; i += batchSize) {
        const batch = insertData.slice(i, i + batchSize);
        await connection.executeMany(
          `INSERT INTO TBL_GENERAL_SAL_NOFEES (POSTED_BY, BATCH_NO, PIN, ACCT_LINK, CR_AMOUNT) VALUES (:1, :2, :3, :4, :5)`,
          batch,
          { autoCommit: true }
        );
      }
      // Delete statemets
      await connection.execute(
        `delete from TBL_GENERAL_SAL_NOFEES where batch_no=:P4_BATCH and acct_link LIKE '%' || 'EOD' || '%'`,
        {
          P4_BATCH: batchNumber,
        },
        { autoCommit: true }
      );
      await connection.execute(
        `delete from TBL_GENERAL_SAL_NOFEES where batch_no=:P4_BATCH and CR_AMOUNT LIKE '%' || 'EOD' || '%'`,
        {
          P4_BATCH: batchNumber,
        },
        { autoCommit: true }
      );
      await connection.execute(
        `delete from TBL_GENERAL_SAL_NOFEES where batch_no=:P4_BATCH and PIN LIKE '%' || 'EOD' || '%'`,
        {
          P4_BATCH: batchNumber,
        },
        { autoCommit: true }
      );
      await connection.execute("commit");
      await connection.execute(
        `delete from TBL_GENERAL_SAL_NOFEES where batch_no=:P4_BATCH and acct_link is null`,
        {
          P4_BATCH: batchNumber,
        },
        { autoCommit: true }
      );
      await connection.execute("commit");
      // select from grid
      const gridQuery = `
     select pin, acct_link, acct_status as account_descrp, cr_amount, br_description, currency_code
     from (
       select pin, acct_link, acct_status, cr_amount, br_description, currency_code
       from vw_generalsalary_nofees
       where batch_no=:P2_BATCH
       order by pin
     )`;
      const Result = await connection.execute(gridQuery, {
        P2_BATCH: batchNumber,
      });
      const validAcctQuery = `select count(a.acct_link) from vw_generalsalary_nofees a where currency_code=:P2_CURRCODE and status_indicator in ('N','DO','DR') and a.batch_no=:P2_BATCH`;
      const invalidAcctQuery = `select count(acct_link) from vw_generalsalary_nofees a where status_indicator is null and a.batch_no='${batchNumber}'`;
      const MismatchesAcctQuery = `select count(a.acct_link)  from vw_generalsalary_nofees a where a.currency_code!=:P2_CURRCODE and a.batch_no=:P2_BATCH`;
      const NotNormalQuery = `select count(a.acct_link)  from vw_generalsalary_nofees a where a.currency_code=:P2_CURRCODE and  a.batch_no=:P2_BATCH and nvl(status_indicator,'X') NOT in ('N','DO','DR')`;
      //const DuplicateEnquiry =`SELECT SUM(duplicate_count)  total_duplicates FROM (SELECT acct_link, COUNT(*) - 1  duplicate_count FROM vw_generalsalary_nofees where batch_no=:P2_BATCH GROUP BY acct_link HAVING COUNT(*) > 1)  subquery`;
      const binds = {
        P2_CURRCODE: currencyCode.trim(),
        P2_BATCH: batchNumber.trim(),
      };

      // const options = {
      //   outFormat: oracledb.OUT_FORMAT_OBJECT,
      // };

      const r1 = await connection.execute(validAcctQuery, binds);
      const r2 = await connection.execute(invalidAcctQuery);
      const r3 = await connection.execute(MismatchesAcctQuery, binds);
      const r4 = await connection.execute(NotNormalQuery, binds);
      //const r5 = await connection.execute(DuplicateEnquiry, binds);

      const AccountCounts = {
        validAccounts: r1.rows[0][0],
        invalidAccounts: r2.rows[0][0],
        CurrencyMismatchesAccounts: r3.rows[0][0],
        notNormalAccounts: r4.rows[0][0],
        //DuplicateAccounts: r5.rows[0][0]
      };
      // console.log(AccountCounts);
      const excelResult = Result.rows.map((row) => ({
        PIN: row[0],
        ACCOUNT_NUMBER: row[1],
        ACCOUNT_DESCRIPTION: row[2],
        CREDIT_AMOUNT: row[3],
        BRANCH_DESCRIPTION: row[4],
        // CURRENCY_CODE: row[5],
      }));

      const newDDD = [AccountCounts, excelResult];
      // console.log(newDDD);
      res.send({
        responseCode: "000",
        responseMessage: "Data uploaded successfully",
        data: newDDD,
      });
    }

    if (key === "uploadFees") {
      let cal = {};
      // Delete existing data for the postedBy user
      await connection.execute(
        `delete from TBL_GENERAL_SAL_FEES where posted_by = :app_user`,
        {
          app_user: postedBy,
        },
        { autoCommit: true }
      );
      // Insert Data
      const insertData = jsonData.map(({ PIN, BBAN, AMOUNT }) => [
        postedBy,
        batchNumber,
        PIN,
        BBAN,
        AMOUNT,
      ]);
      // Insert data in batches
      const batchSize = 1000; // Adjust the batch size as needed
      for (let i = 0; i < insertData.length; i += batchSize) {
        const batch = insertData.slice(i, i + batchSize);
        await connection.executeMany(
          `INSERT INTO TBL_GENERAL_SAL_FEES (POSTED_BY, BATCH_NO, PIN, ACCT_LINK, CR_AMOUNT) VALUES (:1, :2, :3, :4, :5)`,
          batch,
          { autoCommit: true }
        );
      }
      // Delete statemets
      await connection.execute(
        `delete from TBL_GENERAL_SAL_FEES where batch_no=:P4_BATCH and acct_link LIKE '%' || 'EOD' || '%'`,
        {
          P4_BATCH: batchNumber,
        },
        { autoCommit: true }
      );
      await connection.execute(
        `delete from TBL_GENERAL_SAL_FEES where batch_no=:P4_BATCH and CR_AMOUNT LIKE '%' || 'EOD' || '%'`,
        {
          P4_BATCH: batchNumber,
        },
        { autoCommit: true }
      );
      await connection.execute(
        `delete from TBL_GENERAL_SAL_FEES where batch_no=:P4_BATCH and PIN LIKE '%' || 'EOD' || '%'`,
        {
          P4_BATCH: batchNumber,
        },
        { autoCommit: true }
      );
      await connection.execute("commit");
      await connection.execute(
        `delete from TBL_GENERAL_SAL_FEES where batch_no=:P4_BATCH and acct_link is null`,
        {
          P4_BATCH: batchNumber,
        },
        { autoCommit: true }
      );
      await connection.execute("commit");
      // select from grid
      const gridQuery = `
     select pin, acct_link, acct_status as account_descrp, cr_amount, br_description, currency_code
     from (
       select pin, acct_link, acct_status, cr_amount, br_description, currency_code
       from VW_GENERALSALARY_FEES
       where batch_no=:P2_BATCH
       order by pin
     )`;
      const Result = await connection.execute(gridQuery, {
        P2_BATCH: batchNumber,
      });
      const excelResult = Result.rows.map((row) => ({
        PIN: row[0],
        ACCOUNT_NUMBER: row[1],
        ACCOUNT_DESCRIPTION: row[2],
        CREDIT_AMOUNT: row[3],
        BRANCH_DESCRIPTION: row[4],
        // CURRENCY_CODE: row[5],
      }));
      if (excelResult.length > 0) {
        let charge, feeTypeAmt, taxx, feeTypeTax, totalCharge;

        //sum of CREDIT_AMOUNT
        const totalCreditAmount = excelResult.reduce((sum, row) => sum + row.CREDIT_AMOUNT, 0);
        // GET CHARGE
        try {
          let result = await connection.execute(
            `SELECT FEE_AMOUNT, TYPE_OF_FEE FROM TB_TRANS_FEES_EXCEPTION
         WHERE TRANS_CODE = 'SAL' AND currency = :P10_CURRCODE
         AND CUSTOMER_NUMBER = get_customerno(:P10_CONTRA)`,
            [currencyCode, accountNumber]
          );
          [charge, feeTypeAmt] = result.rows[0];
        } catch (error) {
          charge = null;
          feeTypeAmt = null;
        }
        if (charge === null) {
          try {
            let result = await connection.execute(
              `SELECT FEE_AMOUNT, TYPE_OF_FEE FROM tb_trans_fee_details
           WHERE TRANS_CODE = 'SAL' AND currency = :P10_CURRCODE`,
              [currencyCode]
            );
            [charge, feeTypeAmt] = result.rows[0];
          } catch (error) {
            charge = null;
            feeTypeAmt = null;
          }
        }
        // GET TAX
        try {
          let result = await connection.execute(
            `SELECT FEE_AMOUNT, TYPE_OF_FEE FROM tb_trans_tax_exception
         WHERE TRANS_CODE = 'SAL' AND TAX_CODE = 'GST' AND currency = :P10_CURRCODE`,
            [currencyCode]
          );
          [taxx, feeTypeTax] = result.rows[0];
        } catch (error) {
          taxx = null;
          feeTypeTax = null;
        }
        if (taxx === null) {
          try {
            let result = await connection.execute(
              `SELECT FEE_AMOUNT, TYPE_OF_FEE FROM tb_trans_tax
           WHERE TRANS_CODE = 'SAL' AND TAX_CODE = 'GST' AND currency = :P10_CURRCODE`,
              [currencyCode]
            );
            [taxx, feeTypeTax] = result.rows[0];
          } catch (error) {
            taxx = 0;
            feeTypeTax = 0;
          }
        }
        // GET Charges
        if (feeTypeTax === "P" && taxx > 0) {
          taxx = (taxx / 100) * (charge || 1) * excelResult.length;
        } else if (taxx > 0 && feeTypeTax !== "P") {
          taxx = taxx * excelResult.length;
        }
        if (feeTypeAmt === "P" && charge > 0) {
          charge = (charge / 100) * (totalCreditAmount || 1);
        } else if (charge > 0 && feeTypeAmt !== "P") {
          charge = (charge || 1) * excelResult.length;
        }
        totalCharge = (charge || 0) + (taxx || 0);

        // Set response
        cal = {
          Processing: charge.toFixed(2),
          Tax: taxx.toFixed(2),
          Total_Charge: totalCharge.toFixed(2),
          Total_Amount: totalCreditAmount.toFixed(2),
        };
      }
      const validAcctQuery = `select count(a.acct_link) from VW_GENERALSALARY_FEES a where currency_code=:P2_CURRCODE and status_indicator in ('N','DO','DR') and a.batch_no=:P2_BATCH`;
      const invalidAcctQuery = `select count(acct_link) from VW_GENERALSALARY_FEES a where status_indicator is null and a.batch_no='${batchNumber}'`;
      const MismatchesAcctQuery = `select count(a.acct_link)  from VW_GENERALSALARY_FEES a where a.currency_code!=:P2_CURRCODE and a.batch_no=:P2_BATCH`;

      const binds = {
        P2_CURRCODE: currencyCode?.trim(),
        P2_BATCH: batchNumber?.trim(),
      };

      // const options = {
      //   outFormat: oracledb.OUT_FORMAT_OBJECT,
      // };

      const r1 = await connection.execute(validAcctQuery, binds);
      const r2 = await connection.execute(invalidAcctQuery);
      const r3 = await connection.execute(MismatchesAcctQuery, binds);
      // const r4 = await connection.execute(NotNormalQuery, binds);

      const AccountCounts = {
        validAccounts: r1.rows[0][0],
        invalidAccounts: r2.rows[0][0],
        CurrencyMismatchesAccounts: r3.rows[0][0],
        // notNormalAccounts : r4.rows[0][0],
      };
      // console.log(AccountCounts);

      const newDDD = [AccountCounts, excelResult, cal];
      // console.log(newDDD);
      res.send({
        responseCode: "000",
        responseMessage: "Data uploaded successfully",
        data: newDDD,
        // data: excelResult
      });
    }

    if (key === "invalidAccountsFees") {
      invalidAccountquerry = `select pin, acct_link, acct_status as account_descrp, cr_amount
      from (
        select pin, acct_link, acct_status, cr_amount
        from VW_GENERALSALARY_FEES
        where batch_no='${batchNumber}' and status_indicator is null 
        order by pin
      )`;
      const Result = await connection.execute(invalidAccountquerry);
      const invalidAccountResult = Result.rows.map((row) => ({
        PIN: row[0],
        ACCOUNT_NUMBER: row[1],
        ACCOUNT_STATUS: row[2],
        CREDIT_AMOUNT: row[3],
      }));
      res.send({
        responseCode: "000",
        responseMessage: "Invalid Account Result",
        data: invalidAccountResult,
      });
    }
    if (key === "invalidAccounts") {
      invalidAccountquerry = `select pin, acct_link, acct_status as account_descrp, cr_amount
      from (
        select pin, acct_link, acct_status, cr_amount
        from vw_generalsalary_nofees
        where batch_no='${batchNumber}' and status_indicator is null 
        order by pin
      )`;
      const Result = await connection.execute(invalidAccountquerry);
      const invalidAccountResult = Result.rows.map((row) => ({
        PIN: row[0],
        ACCOUNT_NUMBER: row[1],
        ACCOUNT_STATUS: row[2],
        CREDIT_AMOUNT: row[3],
      }));
      res.send({
        responseCode: "000",
        responseMessage: "Invalid Account Result",
        data: invalidAccountResult,
      });
    }
    if (key === "currencyMismatch") {
      currencyMismacthq = ` SELECT
      pin,
      acct_link,
      acct_status AS account_descrp,
      cr_amount,
      (get_curriso(currency_code) || ' - ' || get_currencydesc(currency_code)) AS currency
    FROM (
      SELECT
        pin,
        acct_link,
        acct_status,
        cr_amount,
        currency_code
      FROM vw_generalsalary_nofees
      WHERE batch_no='${batchNumber}' AND currency_code!='${currencyCode}'
      ORDER BY pin
    )`;
      const Result = await connection.execute(currencyMismacthq);
      const currencyMismatchResult = Result.rows.map((row) => ({
        PIN: row[0],
        ACCOUNT_NUMBER: row[1],
        ACCOUNT_DESCRIPTION: row[2],
        // CREDIT_AMOUNT: row[3],
        CURRENCY_CODE: row[4],
        CREDIT_AMOUNT: row[3],
      }));
      console.log(currencyMismatchResult);
      res.send({
        responseCode: "000",
        responseMessage: "Invalid Account Result",
        data: currencyMismatchResult,
      });
    }
    if (key === "currencyMismatchFees") {
      currencyMismacthq = `select pin, acct_link, acct_status as account_descrp, cr_amount, (get_curriso(currency_code) || ' - ' || get_currencydesc(currency_code)) AS currency
      from (
        select pin, acct_link, acct_status, cr_amount, currency_code
        from VW_GENERALSALARY_FEES
        where batch_no='${batchNumber}' and currency_code!='${currencyCode}'
        order by pin )`;
      const Result = await connection.execute(currencyMismacthq);
      const currencyMismatchResult = Result.rows.map((row) => ({
        PIN: row[0],
        ACCOUNT_NUMBER: row[1],
        ACCOUNT_DESCRIPTION: row[2],
        CURRENCY_CODE: row[4],
        CREDIT_AMOUNT: row[3],
      }));
      res.send({
        responseCode: "000",
        responseMessage: "Invalid Account Result",
        data: currencyMismatchResult,
      });
    }
    if (key === "nonNormalModal") {
      NotNormalQuery = `select pin,acct_link,account_descrp,cr_amount,(get_curriso(currency_code) || ' - ' || get_currencydesc(currency_code)) AS currency from (
        select pin,acct_link,acct_status account_descrp,cr_amount,currency_code from
        vw_generalsalary_nofees where currency_code='${currencyCode}' and  batch_no='${batchNumber}' and nvl(status_indicator,'X') NOT in ('N','DO','DR') order by pin )`;
      const Result = await connection.execute(NotNormalQuery);
      const notNormalResult = Result.rows.map((row) => ({
        PIN: row[0],
        ACCOUNT_NUMBER: row[1],
        ACCOUNT_DESCRIPTION: row[2],
        CREDIT_AMOUNT: row[3],
        CURRENCY_CODE: row[4],
      }));
      // console.log(notNormalResult);
      res.send({
        responseCode: "000",
        responseMessage: "Non-Normal Account Result",
        data: notNormalResult,
      });
    }
    if (key === "viewExceptions") {
      viewExceptionsQuery = ` select pin,acct_link,InvalidStatus,cr_amount,currency from (

        select pin,acct_link,STATUS InvalidStatus,cr_amount,
        (get_curriso(currency_code)||' - '||get_currencydesc(currency_code))currency from VW_GENERAL_SALARY_UPLOAD
           where batch_no='${batchNumber}' and nvl(ACCOUNT_DESCRP,'x') != nvl(STATUS,'y') union all 
           
        select bankcode,acct_link,acct_status InvalidStatus ,cr_amount,
        null currency from
         vw_achupload where batch_no='${batchNumber}' and ACCOUNT_DESCRP!=acct_status   order by pin
         
         )`;
      const Result = await connection.execute(viewExceptionsQuery);
      const viewExceptionsResult = Result.rows.map((row) => ({
        PIN: row[0],
        ACCOUNT_NUMBER: row[1],
        ACCOUNT_DESCRIPTION: row[2],
        CREDIT_AMOUNT: row[3],
        CURRENCY_CODE: row[4],
      }));
      // console.log(viewExceptionsResult);
      res.send({
        responseCode: "000",
        responseMessage: "View Exceptions Account Result",
        data: viewExceptionsResult,
      });
    }
    if (key === "viewExceptionsFees") {
      viewExceptionsQuery = `select pin,acct_link,InvalidStatus,cr_amount,currency from (

        select pin,acct_link,STATUS InvalidStatus,cr_amount,
        (get_curriso(currency_code)||' - '||get_currencydesc(currency_code))currency from VW_GENERAL_SALARY_UPLOAD
           where batch_no='${batchNumber}' and nvl(ACCOUNT_DESCRP,'x') != nvl(STATUS,'y') union all 
           
        select bankcode,acct_link,acct_status InvalidStatus ,cr_amount,
        null currency from
         vw_achupload where batch_no='${batchNumber}' and ACCOUNT_DESCRP!=acct_status   order by pin
         
         )`;
      const Result = await connection.execute(viewExceptionsQuery);
      const viewExceptionsResult = Result.rows.map((row) => ({
        PIN: row[0],
        ACCOUNT_NUMBER: row[1],
        ACCOUNT_DESCRIPTION: row[2],
        CREDIT_AMOUNT: row[3],
        CURRENCY_CODE: row[4],
      }));
      res.send({
        responseCode: "000",
        responseMessage: "View Exceptions Account Result",
        data: viewExceptionsResult,
      });
    }
    if (formCode === "CHQQ") {
      const gettrans = await connection.execute(` SELECT SYS_CODE actual_code
    FROM CODE_DESC a ,sysgen_transactions b
    WHERE CODE_TYPE='TR' 
    and a.actual_code  = b.actual_code
    AND a.actual_code ='SAL'`);
      const transCode = gettrans.rows[0][0];
      console.log(transCode);
      // console.log(transCode);
      connection.execute(
        "BEGIN prc_uploadsalary_nofees(:P2_BATCH, :P2_CONTRA, :app_user, :BRA_CODE, :P2_NARRATION, :P2_CREDITNARR, :P2_SCANDOC, :P2_TRANSCODE, :TERMINAL, :FORMCODE, :mess_v,:allow_dup); END;",
        {
          P2_BATCH: batchNumber,
          P2_CONTRA: accountNumber,
          app_user: postedBy,
          BRA_CODE: branchCode,
          P2_NARRATION: debitNarration,
          P2_CREDITNARR: creditNarration,
          P2_SCANDOC: scanDoc,
          P2_TRANSCODE: transCode,
          TERMINAL: terminalId,
          FORMCODE: formCode,
          allow_dup: allowDup,
          mess_v: {
            type: oracledb.STRING,
            dir: oracledb.BIND_OUT,
          },
        },
        function (err, result) {
          if (err) {
            console.log(err);
          }
          console.log(result?.outBinds);
          if (
            result?.outBinds?.mess_v === null ||
            result?.outBinds?.mess_v === "null" ||
            result?.outBinds?.mess_v === "S"
          ) {
            res.send({
              responseCode: "000",
              responseMessage: "Data Uploaded Successfully",
            });
          } else {
            console.log(result.outBinds.mess_v);
            res.send({
              responseCode: "998",
              responseMessage: "Failed to Upload Dat",
            });
          }
        }
      );
    }
    if (formCode === "TFZB") {
      const gettrans = await connection.execute(` SELECT SYS_CODE actual_code
    FROM CODE_DESC a ,sysgen_transactions b
    WHERE CODE_TYPE='TR' 
    and a.actual_code  = b.actual_code
    AND a.actual_code ='SAL'`);
      const transCode = gettrans.rows[0][0];
      connection.execute(
        "BEGIN prc_uploadsalary_fees(:batch_v, :contra_v, :user_v, :bra_v, :narration_v, :Cnarration_v, :doc_v, :transCode_v, :hostname_v, :formcode, :charge_v, :tax_v, :cur_v, :totalcharge_v, :mess_v); END;",
        {
          batch_v: batchNumber,
          contra_v: accountNumber,
          user_v: postedBy,
          bra_v: branchCode,
          narration_v: debitNarration,
          Cnarration_v: creditNarration,
          doc_v: scanDoc,
          transCode_v: transCode,
          hostname_v: terminalId,
          formcode: formCode,
          charge_v: feeCharge,
          tax_v: feeTax,
          cur_v: currencyCode,
          totalcharge_v: {
            type: oracledb.NUMBER,
            dir: oracledb.BIND_OUT,
          },
          mess_v: {
            type: oracledb.STRING,
            dir: oracledb.BIND_OUT,
          },
        },
        function (err, result) {
          if (err) {
            console.log(err);
          }
          if (result?.outBinds?.mess_v === "S") {
            res.send({
              responseCode: "000",
            });
          } else {
            console.log(result.outBinds.mess_v);
            res.send({
              responseCode: "998",
              responseMessage: "Failed to Upload Data",
            });
          }
        }
      );
    }
    if (key === "AccountsWithExceptions") {
      querry = `select cheque_no Pin, account,account_desc,acct_status,amount
     from TB_SALARYUPLOAD_EXCEPTION where batch_no='${batchNumber}'`;
      const Result = await connection.execute(querry);
      const viewExceptionsResult = Result.rows.map((row) => ({
        PIN: row[0],
        ACCOUNT_NUMBER: row[1],
        ACCOUNT_DESCRIPTION: row[2],
        EXCEPTION: row[3],
        CREDIT_AMOUNT: row[4],
      }));
      //  console.log(viewExceptionsResult);
      res.send({
        responseCode: "000",
        responseMessage: "Accounts Exceptions",
        data: viewExceptionsResult,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.send({
      responseCode: "999",
      responseMessage: "An Error Occured",
    });
  }
});



app.get("/api/get-unique-ref", (req, res) => {
  let getBatchNumberAPI = async () => {
    try {
      const db = await oracledb.getConnection({
        user: DB_USER,
        password: DB_PASSWORD,
        connectString: DB_CONNECTION_STRING,
        timeout: DB_CONNECTION_TIMEOUT,
      });

      const response = [];
      let arr0 = "";

      // node native promisify
      const execute = util.promisify(db.execute).bind(db);

      const data = await execute(`SELECT Get_batchno as unique_ref FROM dual`);

      if (data) {
        const column = data.metaData[0].name;
        const row = data.rows[0];
        // for (let i = 0; i < data.rows.length; i++) {
        //   response.push({
        //     unique_ref: data.rows[i][0],
        //   });
        // }

        res.send({
          [column]: row
        });
      } else {
        res.send("Something went wrong... Nothing was returned!!");
      }
    } finally {
      // conn.end();
    }
  };

  getBatchNumberAPI();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`${process.env.ORACLE_USER}`);
  console.log(`${process.env.ORACLE_PASSWORD}`);
  console.log(`${process.env.ORACLE_CONNECT_STRING}`);
  
}); 